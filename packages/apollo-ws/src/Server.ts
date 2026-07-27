import { WebSocket, WebSocketServer, AddressInfo } from 'ws'
import { Socket } from 'net'
import type { Logger } from '@repo/logger'
import { ApolloEvents } from './ApolloEvents'
import { DataSourceCommand } from './DataSource'
import { formatCommandArgsForLog } from './formatCommandArgsForLog'
import { notifyError, type ErrorHandler } from './notifyError'

export type ApolloWebSocketOptions = {
  /**
   * Defaults to 3678
   */
  port?: number
  logger: Logger
  onError: ErrorHandler
}

type Client = {
  subscriptions: Set<string>
  socket: Socket
  ws: WebSocket
}

export class Server {
  public vent: ApolloEvents = new ApolloEvents()
  private readonly clients: Set<Client> = new Set<Client>()
  private readonly feedDebounceTimeout: Map<string, NodeJS.Timeout> = new Map()
  private wsServer: WebSocketServer | undefined

  private readonly onFeed = (id: string, value: unknown): void => {
    const previousTimeoutId = this.feedDebounceTimeout.get(id)
    if (previousTimeoutId !== undefined) {
      clearTimeout(previousTimeoutId)
    }

    this.feedDebounceTimeout.set(
      id,
      setTimeout(() => {
        this.feedDebounceTimeout.delete(id)
        this.feed(id, value)
      }, 1000),
    )
  }

  public static async listen<T>(
    { port = 3678, logger, onError }: ApolloWebSocketOptions,
    init: (instance: Server) => Promise<T>,
  ): Promise<T> {
    const serv = new Server({ port, logger, onError })
    const ret = await init(serv)
    await serv.connect()

    return ret
  }

  private constructor(
    private readonly options: Required<Pick<ApolloWebSocketOptions, 'port' | 'logger'>> &
      Pick<ApolloWebSocketOptions, 'onError'>,
  ) {}

  public async close(): Promise<void> {
    for (const timeoutId of this.feedDebounceTimeout.values()) {
      clearTimeout(timeoutId)
    }
    this.feedDebounceTimeout.clear()

    this.vent.removeListener('feed', this.onFeed)

    for (const client of this.clients) {
      client.ws.close()
    }
    this.clients.clear()

    if (this.wsServer !== undefined) {
      const server = this.wsServer
      this.wsServer = undefined

      await new Promise<void>((resolve, reject) => {
        server.close(err => (err ? reject(err) : resolve()))
      })
    }

    this.options.logger.info('Apollo WebSocket Server closed.')
  }

  private feed(id: string, value: unknown): void {
    const content = JSON.stringify(value)

    const outbox: Promise<Client>[] = []
    for (const client of this.clients) {
      if (client.subscriptions.has('*') || client.subscriptions.has(id)) {
        outbox.push(
          new Promise((resolve, reject) => {
            this.options.logger.debug(`Feed Client <${client.socket.remoteAddress}> with <${id}>`)
            client.ws.send(`FEED ${id} ${content}`, e => (e ? reject(e) : resolve(client)))
          }),
        )
      } else {
        this.options.logger.debug(`Skip Feed Client <${client.socket.remoteAddress}> with <${id}>`)
      }
    }

    Promise.all(outbox)
      .then(() => {
        // this.options.logger.info(`Feed <${id}> broadcast successful. [ ${clients.map(client => `<${client.socket.remoteAddress}>`)} ]`)
      })
      .catch(e => {
        notifyError(this.options.logger, this.options.onError, 'warn', `Feed <${id}> broadcast error`, e)
      })
  }

  private connect(): Promise<void> {
    const server = new WebSocketServer({ port: this.options.port })
    this.wsServer = server

    server.on('connection', (ws, req) => {
      const client: Client = {
        subscriptions: new Set<string>(),
        socket: req.socket,
        ws,
      }

      this.options.logger.info(`Client <${client.socket.remoteAddress}> connected.`)

      ws.on('message', data => {
        const [cmd, ...params] = data.toString('utf-8').split(' ')

        if (cmd === 'subscribe') {
          params.forEach(sub => client.subscriptions.add(sub))

          this.options.logger.info(`Client <${client.socket.remoteAddress}> requests subscription of [ ${params} ].`)
          this.vent.emit('feeds-request', params)
        } else if (cmd === 'refresh') {
          const feeds = new Set<string>(params)

          this.options.logger.info(
            `Client <${client.socket.remoteAddress}> requests refresh of [ ${[...feeds.values()]} ].`,
          )
          this.vent.emit('feeds-refresh', feeds.values())
        } else if (cmd === 'command') {
          const [sourceId, name, ...args] = params
          const argsText = args.join(' ')
          const command: DataSourceCommand = {
            args: argsText,
            sourceId,
            name,
          }

          this.options.logger.info(
            `Client <${client.socket.remoteAddress}> requested feed ${sourceId} command ${name} with arguments "${formatCommandArgsForLog(argsText)}"`,
          )
          this.vent.emit('command', command)
        } else {
          this.options.logger.info(`Client <${client.socket.remoteAddress}> sent unknown command <${cmd}>`)
        }
      })

      this.clients.add(client)
      ws.on('error', e => {
        notifyError(
          this.options.logger,
          this.options.onError,
          'warn',
          `Client <${client.socket.remoteAddress}> socket error`,
          e,
        )
      })

      ws.on('close', () => {
        this.options.logger.info(`Client <${client.socket.remoteAddress}> disconnected.`)
        this.clients.delete(client)
      })
    })

    this.vent.addListener('feed', this.onFeed)

    return new Promise((resolve, reject) => {
      server.on('listening', () => {
        const addr = server.address() as AddressInfo
        const port =
          typeof server.address() === 'string' ? server.address() : `${addr.family} ${addr.address}:${addr.port}`
        this.options.logger.info(`Apollo WebSocket Server listening for connections at <${port}>`)

        resolve()
      })

      server.on('error', e => {
        notifyError(
          this.options.logger,
          this.options.onError,
          'fatal',
          'Apollo WebSocket Server network port bind error',
          e,
        )
        reject(e)
      })
    })
  }
}

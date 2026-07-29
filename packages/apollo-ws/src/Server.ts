import { WebSocket, WebSocketServer } from 'ws'
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

function clientIp(socket: Socket): string {
  return socket.remoteAddress ?? 'unknown'
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

    this.options.logger.info('Apollo WebSocket Server closed')
  }

  private feed(id: string, value: unknown): void {
    const content = JSON.stringify(value)

    const outbox: Promise<Client>[] = []
    for (const client of this.clients) {
      const ip = clientIp(client.socket)
      if (client.subscriptions.has('*') || client.subscriptions.has(id)) {
        outbox.push(
          new Promise((resolve, reject) => {
            this.options.logger.debug({ feedId: id, clientIp: ip }, 'Feed broadcast to client')
            client.ws.send(`FEED ${id} ${content}`, e => (e ? reject(e) : resolve(client)))
          }),
        )
      } else {
        this.options.logger.debug({ feedId: id, clientIp: ip }, 'Skip feed broadcast to client')
      }
    }

    Promise.all(outbox).catch(e => {
      notifyError(this.options.logger, this.options.onError, 'warn', 'Feed broadcast error', e, { feedId: id })
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
      const ip = clientIp(client.socket)

      this.options.logger.info({ clientIp: ip }, 'Client connected')

      ws.on('message', data => {
        const [cmd, ...params] = data.toString('utf-8').split(' ')

        if (cmd === 'subscribe') {
          params.forEach(sub => client.subscriptions.add(sub))

          this.options.logger.info({ clientIp: ip, feedIds: params }, 'Client subscribed')
          this.vent.emit('feeds-request', params)
        } else if (cmd === 'refresh') {
          const feeds = new Set<string>(params)

          this.options.logger.info({ clientIp: ip, feedIds: [...feeds] }, 'Client requested refresh')
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
            {
              clientIp: ip,
              sourceId,
              commandName: name,
              commandArgs: formatCommandArgsForLog(argsText),
            },
            'Client requested command',
          )
          this.vent.emit('command', command)
        } else {
          this.options.logger.info({ clientIp: ip, cmd }, 'Client sent unknown command')
        }
      })

      this.clients.add(client)
      this.vent.emit('clients-changed', this.clients.size)
      ws.on('error', e => {
        notifyError(this.options.logger, this.options.onError, 'warn', 'Client socket error', e, { clientIp: ip })
      })

      ws.on('close', () => {
        this.options.logger.info({ clientIp: ip }, 'Client disconnected')
        this.clients.delete(client)
        this.vent.emit('clients-changed', this.clients.size)
      })
    })

    this.vent.addListener('feed', this.onFeed)

    return new Promise((resolve, reject) => {
      server.on('listening', () => {
        this.options.logger.info({ port: this.options.port }, 'Apollo WebSocket Server listening')

        resolve()
      })

      server.on('error', e => {
        notifyError(
          this.options.logger,
          this.options.onError,
          'fatal',
          'Apollo WebSocket Server network port bind error',
          e,
          { port: this.options.port },
        )
        reject(e)
      })
    })
  }
}

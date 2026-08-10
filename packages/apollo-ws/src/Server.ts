import { WebSocket, WebSocketServer } from 'ws'
import { Socket } from 'net'
import type { Logger } from '@repo/logger'
import { FeedEvents, type ErrorHandler } from '@repo/feeds'

export type ApolloWebSocketOptions = {
  /**
   * Defaults to 3678
   */
  port?: number
  logger: Logger
  onError: ErrorHandler
  feedEvents: FeedEvents
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
  private readonly feedEvents: FeedEvents
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

  public static async listen(
    { port = 3678, logger, onError, feedEvents }: ApolloWebSocketOptions,
    init?: (instance: Server, logger: Logger, onError: ErrorHandler) => Promise<void>,
  ): Promise<Server> {
    const serv = new Server({ port, logger, onError, feedEvents })
    await serv.connect()

    if (init !== undefined) {
      await init(serv, logger, onError)
    }

    return serv
  }

  private constructor(private readonly options: ApolloWebSocketOptions) {
    this.feedEvents = options.feedEvents
  }

  public async close(): Promise<void> {
    for (const timeoutId of this.feedDebounceTimeout.values()) {
      clearTimeout(timeoutId)
    }
    this.feedDebounceTimeout.clear()

    this.feedEvents.removeListener('feed', this.onFeed)

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
      this.options.logger.warn({ err: e, feedId: id }, 'Feed broadcast error')
      this.options.onError(e, 'Feed broadcast error')
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
          this.feedEvents.emit('feeds-request', params)
        } else {
          this.options.logger.info({ clientIp: ip, cmd }, 'Client sent unknown command')
        }
      })

      this.clients.add(client)
      this.feedEvents.emit('clients-changed', this.clients.size)
      ws.on('error', e => {
        this.options.logger.warn({ err: e, clientIp: ip }, 'Client socket error')
        this.options.onError(e, 'Client socket error')
      })

      ws.on('close', () => {
        this.options.logger.info({ clientIp: ip }, 'Client disconnected')
        this.clients.delete(client)
        this.feedEvents.emit('clients-changed', this.clients.size)
      })
    })

    this.feedEvents.addListener('feed', this.onFeed)

    return new Promise((resolve, reject) => {
      server.on('listening', () => {
        this.options.logger.info({ port: this.options.port }, 'Apollo WebSocket Server listening')

        resolve()
      })

      server.on('error', e => {
        this.options.logger.fatal(
          { err: e, port: this.options.port },
          'Apollo WebSocket Server network port bind error',
        )
        this.options.onError(e, 'Apollo WebSocket Server network port bind error')
        reject(e)
      })
    })
  }
}

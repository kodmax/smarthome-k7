import { WebSocket, WebSocketServer, AddressInfo } from 'ws'
import { EventEmitter } from 'events'
import { Socket } from 'net'
import { DataSourceCommand } from './DataSource'

export type ApolloWebSocketOptions = {
  /**
   * Defaults to 3678
   */
  port?: number
}

type Client = {
  subscriptions: Set<string>
  socket: Socket
  ws: WebSocket
}

export class Server {
  public vent: EventEmitter = new EventEmitter()
  private readonly clients: Set<Client> = new Set<Client>()
  private readonly feedDebounceTimeout: Map<string, NodeJS.Timeout> = new Map()

  public static async listen<T>(
    { port = 3678 }: ApolloWebSocketOptions,
    init: (instance: Server) => Promise<T>,
  ): Promise<T> {
    const serv = new Server({ port })
    const ret = await init(serv)
    await serv.connect()

    return ret
  }

  private constructor(private readonly options: Required<ApolloWebSocketOptions>) {}
  private feed(id: string, value: unknown): void {
    const content = JSON.stringify(value)

    const outbox: Promise<Client>[] = []
    for (const client of this.clients) {
      if (client.subscriptions.has('*') || client.subscriptions.has(id)) {
        outbox.push(
          new Promise((resolve, reject) => {
            this.vent.emit('sys-log', 7, `Feed Client <${client.socket.remoteAddress}> with <${id}>`)
            client.ws.send(`FEED ${id} ${content}`, e => (e ? reject(e) : resolve(client)))
          }),
        )
      } else {
        this.vent.emit('sys-log', 7, `Skip Feed Client <${client.socket.remoteAddress}> with <${id}>`)
      }
    }

    Promise.all(outbox)
      .then(() => {
        // this.vent.emit('sys-log', 6, `Feed <${id}> broadcast successful. [ ${clients.map(client => `<${client.socket.remoteAddress}>`)} ]`)
      })
      .catch(e => {
        this.vent.emit('sys-log', 4, `Feed <${id}> broadcast error: ${e}`)
      })
  }

  private connect(): Promise<void> {
    const server = new WebSocketServer({ port: this.options.port })

    server.on('connection', (ws, req) => {
      const client: Client = {
        subscriptions: new Set<string>(),
        socket: req.socket,
        ws,
      }

      this.vent.emit('sys-log', 6, `Client <${client.socket.remoteAddress}> connected.`)

      ws.on('message', data => {
        const [cmd, ...params] = data.toString('utf-8').split(' ')

        if (cmd === 'subscribe') {
          params.forEach(sub => client.subscriptions.add(sub))

          this.vent.emit(
            'sys-log',
            6,
            `Client <${client.socket.remoteAddress}> requests subscription of [ ${params} ].`,
          )
          this.vent.emit('feeds-request', params)
        } else if (cmd === 'refresh') {
          const feeds = new Set<string>(params)

          this.vent.emit(
            'sys-log',
            6,
            `Client <${client.socket.remoteAddress}> requests refresh of [ ${[...feeds.values()]} ].`,
          )
          this.vent.emit('feeds-refresh', feeds.values())
        } else if (cmd === 'command') {
          const [sourceId, name, ...args] = params
          const command: DataSourceCommand = {
            args: args.join(' '),
            sourceId,
            name,
          }

          this.vent.emit(
            'sys-log',
            `Client <${client.socket.remoteAddress}> requested feed ${sourceId} command ${name} with arguments "${args.join(' ')}"`,
          )
          this.vent.emit('command', command)
        }
      })

      this.clients.add(client)
      ws.on('error', e => {
        this.vent.emit('sys-log', 5, `Client <${client.socket.remoteAddress}> socket error: ` + e.toString(), e)
      })

      ws.on('close', () => {
        this.vent.emit('sys-log', 6, `Client <${client.socket.remoteAddress}> disconnected.`)
        this.clients.delete(client)
      })
    })

    this.vent.addListener('feed', (id: string, value: unknown) => {
      const previousTimeoutId = this.feedDebounceTimeout.get(id)
      if (previousTimeoutId !== undefined) {
        clearTimeout(previousTimeoutId)
      }

      this.feedDebounceTimeout.set(
        id,
        setTimeout(() => {
          this.feed(id, value)
        }, 1000),
      )
    })

    return new Promise((resolve, reject) => {
      server.on('listening', () => {
        const addr = server.address() as AddressInfo
        const port =
          typeof server.address() === 'string' ? server.address() : `${addr.family} ${addr.address}:${addr.port}`
        this.vent.emit('sys-log', 5, `Apollo WebSocket Server listening for connections at <${port}>`)

        resolve()
      })

      server.on('error', e => {
        this.vent.emit('sys-log', 2, `Apollo WebSocket Server network port bind error: ${e}`, e)
        reject(e)
      })
    })
  }
}

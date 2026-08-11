import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import type { ErrorHandler, FeedEvents } from '@repo/feeds'
import type { Logger } from '@repo/logger'
import type { Socket } from 'net'
import type { WebSocket } from 'ws'
import { AppLogger } from '../logger/app-logger.service'
import { FEED_EVENTS, WS_ON_ERROR } from './events.constants'

type Client = {
  subscriptions: Set<string>
  socket: Socket
  ws: WebSocket
}

function clientIp(socket: Socket): string {
  return socket.remoteAddress ?? 'unknown'
}

@Injectable()
export class FeedWebSocketService implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger
  private readonly clients = new Set<Client>()
  private readonly feedDebounceTimeout = new Map<string, NodeJS.Timeout>()

  private readonly onFeedChanged = (id: string): void => {
    const previousTimeoutId = this.feedDebounceTimeout.get(id)
    if (previousTimeoutId !== undefined) {
      clearTimeout(previousTimeoutId)
    }

    this.feedDebounceTimeout.set(
      id,
      setTimeout(() => {
        this.feedDebounceTimeout.delete(id)
        this.notifyFeedUpdate(id)
      }, 1000),
    )
  }

  constructor(
    appLogger: AppLogger,
    @Inject(FEED_EVENTS) private readonly feedEvents: FeedEvents,
    @Inject(WS_ON_ERROR) private readonly onError: ErrorHandler,
  ) {
    this.logger = appLogger.forComponent('ws')
  }

  onModuleInit(): void {
    this.feedEvents.addListener('feed-changed', this.onFeedChanged)
  }

  async onModuleDestroy(): Promise<void> {
    for (const timeoutId of this.feedDebounceTimeout.values()) {
      clearTimeout(timeoutId)
    }
    this.feedDebounceTimeout.clear()

    this.feedEvents.removeListener('feed-changed', this.onFeedChanged)

    for (const client of this.clients) {
      client.ws.close()
    }
    this.clients.clear()

    this.logger.info('WebSocket server closed')
  }

  registerClient(ws: WebSocket, socket: Socket): void {
    const client: Client = {
      subscriptions: new Set<string>(),
      socket,
      ws,
    }
    const ip = clientIp(socket)

    this.logger.info({ clientIp: ip }, 'Client connected')

    ws.on('message', data => {
      const [cmd, ...params] = data.toString('utf-8').split(' ')

      if (cmd === 'subscribe') {
        params.forEach(sub => client.subscriptions.add(sub))
        this.logger.info({ clientIp: ip, feedIds: params }, 'Client subscribed')
      } else if (cmd === 'unsubscribe') {
        params.forEach(sub => client.subscriptions.delete(sub))
        this.logger.info({ clientIp: ip, feedIds: params }, 'Client unsubscribed')
      } else {
        this.logger.info({ clientIp: ip, cmd }, 'Client sent unknown command')
      }
    })

    ws.on('error', error => {
      this.logger.warn({ err: error, clientIp: ip }, 'Client socket error')
      this.onError(error, 'Client socket error')
    })

    ws.on('close', () => {
      this.unregisterClient(ws)
    })

    this.clients.add(client)
    this.feedEvents.emit('clients-changed', this.clients.size)
  }

  unregisterClient(ws: WebSocket): void {
    for (const client of this.clients) {
      if (client.ws !== ws) {
        continue
      }

      const ip = clientIp(client.socket)
      this.logger.info({ clientIp: ip }, 'Client disconnected')
      this.clients.delete(client)
      this.feedEvents.emit('clients-changed', this.clients.size)
      return
    }
  }

  private notifyFeedUpdate(id: string): void {
    const outbox: Promise<Client>[] = []

    for (const client of this.clients) {
      const ip = clientIp(client.socket)
      if (client.subscriptions.has('*') || client.subscriptions.has(id)) {
        outbox.push(
          new Promise((resolve, reject) => {
            this.logger.debug({ feedId: id, clientIp: ip }, 'Feed update broadcast to client')
            client.ws.send(`FEED-UPDATE ${id}`, error => (error ? reject(error) : resolve(client)))
          }),
        )
      } else {
        this.logger.debug({ feedId: id, clientIp: ip }, 'Skip feed update broadcast to client')
      }
    }

    Promise.all(outbox).catch(error => {
      this.logger.warn({ err: error, feedId: id }, 'Feed update broadcast error')
      this.onError(error, 'Feed update broadcast error')
    })
  }
}

import WebSocket, { type ClientOptions } from 'ws'

const RECONNECT_DELAY_MS = 3000
const DEFAULT_FEED_TIMEOUT_MS = 15000

type FeedWaiter = {
  resolve: (value: unknown) => void
  reject: (error: Error) => void
  timer: NodeJS.Timeout
}

export class FeedStore {
  private readonly cache = new Map<string, unknown>()
  private readonly subscriptions = new Set<string>()
  private readonly commandQueue: string[] = []
  private readonly feedWaiters = new Map<string, FeedWaiter>()
  private ws: WebSocket | null = null
  private reconnectTimer: NodeJS.Timeout | undefined

  constructor(
    private readonly url: string,
    private readonly wsOptions: ClientOptions = {},
  ) {}

  start(feedIds: readonly string[]): void {
    for (const feedId of feedIds) {
      this.subscriptions.add(feedId)
    }

    this.connect()
  }

  get<T>(feedId: string): T | undefined {
    return this.cache.get(feedId) as T | undefined
  }

  getMany<T>(feedIds: readonly string[]): Partial<Record<string, T>> {
    const results: Partial<Record<string, T>> = {}

    for (const feedId of feedIds) {
      const value = this.cache.get(feedId)
      if (value !== undefined) {
        results[feedId] = value as T
      }
    }

    return results
  }

  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  command(sourceId: string, name: string, args: string): void {
    const commandText = `command ${sourceId} ${name} ${args}`

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(commandText)
      return
    }

    this.commandQueue.push(commandText)
  }

  waitForFeed<T>(feedId: string, timeoutMs = DEFAULT_FEED_TIMEOUT_MS): Promise<T> {
    return new Promise((resolve, reject) => {
      const existing = this.feedWaiters.get(feedId)
      if (existing) {
        clearTimeout(existing.timer)
        existing.reject(new Error(`Wait for feed ${feedId} superseded by a newer request`))
      }

      const timer = setTimeout(() => {
        this.feedWaiters.delete(feedId)
        reject(new Error(`Timeout waiting for feed ${feedId}`))
      }, timeoutMs)

      this.feedWaiters.set(feedId, {
        resolve: value => resolve(value as T),
        reject,
        timer,
      })
    })
  }

  close(): void {
    if (this.reconnectTimer !== undefined) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = undefined
    }

    for (const waiter of this.feedWaiters.values()) {
      clearTimeout(waiter.timer)
      waiter.reject(new Error('FeedStore closed'))
    }
    this.feedWaiters.clear()

    this.ws?.close()
    this.ws = null
  }

  private connect(): void {
    const ws = new WebSocket(this.url, this.wsOptions)
    this.ws = ws

    ws.on('open', () => {
      console.error('[dashboard-mcp] apollo ws connected')
      ws.send(`subscribe ${[...this.subscriptions].join(' ')}`)

      for (const commandText of this.commandQueue) {
        ws.send(commandText)
      }
      this.commandQueue.length = 0
    })

    ws.on('message', data => {
      const text = data.toString()
      if (!text.startsWith('FEED ')) return

      const spaceIndex = text.indexOf(' ', 5)
      const topic = text.slice(5, spaceIndex)
      if (!this.subscriptions.has(topic)) return

      const payload = JSON.parse(text.slice(spaceIndex + 1))
      this.cache.set(topic, payload)

      const waiter = this.feedWaiters.get(topic)
      if (waiter) {
        clearTimeout(waiter.timer)
        this.feedWaiters.delete(topic)
        waiter.resolve(payload)
      }
    })

    ws.on('close', () => {
      console.error('[dashboard-mcp] apollo ws disconnected, reconnecting…')
      this.ws = null
      this.scheduleReconnect()
    })

    ws.on('error', error => {
      console.error('[dashboard-mcp] apollo ws error:', error.message)
    })
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer !== undefined) return

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = undefined
      this.connect()
    }, RECONNECT_DELAY_MS)
  }
}

import { OnFeedChanged } from './types'

const FEED_UPDATE_PREFIX = 'FEED-UPDATE '

const isWebSocketOpen = (ws: WebSocket): boolean => ws.readyState === WebSocket.OPEN

export class WSClient {
  private readonly topics: Set<string> = new Set<string>()
  private syncScheduled = false
  private ws: WebSocket

  constructor(uri: string, onFeedChanged: OnFeedChanged) {
    this.ws = this.connect(uri, onFeedChanged)
  }

  connect(uri: string, onFeedChanged: OnFeedChanged): WebSocket {
    const ws = new WebSocket(uri)

    ws.addEventListener('open', () => {
      this.syncSubscriptions()
    })

    ws.addEventListener('message', (ev: MessageEvent<string>) => {
      if (ev.data.startsWith(FEED_UPDATE_PREFIX)) {
        onFeedChanged(ev.data.slice(FEED_UPDATE_PREFIX.length))
      }
    })

    ws.addEventListener('close', () => {
      this.syncScheduled = false
      this.ws = this.connect(uri, onFeedChanged)
    })

    return ws
  }

  subscribe(topic: string): void {
    if (this.topics.has(topic)) {
      return
    }

    this.topics.add(topic)
    this.scheduleSync()
  }

  unsubscribe(topic: string): void {
    if (!this.topics.delete(topic)) {
      return
    }

    this.scheduleSync()
  }

  private scheduleSync(): void {
    if (this.syncScheduled) {
      return
    }

    this.syncScheduled = true
    queueMicrotask(() => {
      this.syncScheduled = false
      this.syncSubscriptions()
    })
  }

  private syncSubscriptions(): void {
    if (!isWebSocketOpen(this.ws)) {
      return
    }

    const payload = [...this.topics].join(' ')
    this.ws.send(payload.length > 0 ? `subscribe ${payload}` : 'subscribe')
  }
}

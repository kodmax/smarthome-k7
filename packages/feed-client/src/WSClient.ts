import { OnFeedChanged } from './types'

const FEED_UPDATE_PREFIX = 'FEED-UPDATE '

export class WSClient {
  private readonly topics: Set<string> = new Set<string>()
  private readonly pendingSubscribes: Set<string> = new Set<string>()
  private readonly pendingUnsubscribes: Set<string> = new Set<string>()
  private flushScheduled = false
  private ws: WebSocket

  constructor(uri: string, onFeedChanged: OnFeedChanged) {
    this.ws = this.connect(uri, onFeedChanged)
  }

  connect(uri: string, onFeedChanged: OnFeedChanged): WebSocket {
    const ws = new WebSocket(uri)

    ws.addEventListener('open', () => {
      if (this.topics.size > 0) {
        ws.send(`subscribe ${[...this.topics].join(' ')}`)
      }
    })

    ws.addEventListener('message', (ev: MessageEvent<string>) => {
      if (ev.data.startsWith(FEED_UPDATE_PREFIX)) {
        onFeedChanged(ev.data.slice(FEED_UPDATE_PREFIX.length))
      }
    })

    ws.addEventListener('close', () => {
      this.pendingSubscribes.clear()
      this.pendingUnsubscribes.clear()
      this.flushScheduled = false
      this.ws = this.connect(uri, onFeedChanged)
    })

    return ws
  }

  subscribe(topic: string): void {
    const isNew = !this.topics.has(topic)
    this.topics.add(topic)

    if (!isNew || this.ws.readyState !== this.ws.OPEN) {
      return
    }

    if (this.pendingUnsubscribes.delete(topic)) {
      return
    }

    this.pendingSubscribes.add(topic)
    this.scheduleFlush()
  }

  unsubscribe(topic: string): void {
    if (!this.topics.has(topic)) {
      return
    }

    this.topics.delete(topic)

    if (this.ws.readyState !== this.ws.OPEN) {
      return
    }

    if (this.pendingSubscribes.delete(topic)) {
      return
    }

    this.pendingUnsubscribes.add(topic)
    this.scheduleFlush()
  }

  private scheduleFlush(): void {
    if (this.flushScheduled) {
      return
    }

    this.flushScheduled = true
    queueMicrotask(() => {
      this.flushScheduled = false
      this.flushPending()
    })
  }

  private flushPending(): void {
    if (this.ws.readyState !== this.ws.OPEN) {
      this.pendingSubscribes.clear()
      this.pendingUnsubscribes.clear()
      return
    }

    if (this.pendingSubscribes.size > 0) {
      this.ws.send(`subscribe ${[...this.pendingSubscribes].join(' ')}`)
      this.pendingSubscribes.clear()
    }

    if (this.pendingUnsubscribes.size > 0) {
      this.ws.send(`unsubscribe ${[...this.pendingUnsubscribes].join(' ')}`)
      this.pendingUnsubscribes.clear()
    }
  }
}

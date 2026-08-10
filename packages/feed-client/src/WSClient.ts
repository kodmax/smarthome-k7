import { OnFeedChanged } from './types'

const FEED_UPDATE_PREFIX = 'FEED-UPDATE '

export class WSClient {
  private readonly topics: Set<string> = new Set<string>()
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
      this.ws = this.connect(uri, onFeedChanged)
    })

    return ws
  }

  subscribe(topic: string): void {
    if (this.ws.readyState === this.ws.OPEN && !this.topics.has(topic)) {
      this.ws.send(`subscribe ${topic}`)
    }

    this.topics.add(topic)
  }
}

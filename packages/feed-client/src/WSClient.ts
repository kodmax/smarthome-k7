import { Command, OnMessage } from './types'

export class WSClient {
  private readonly topics: Set<string> = new Set<string>()
  private ws: WebSocket

  constructor(uri: string, onMessage: OnMessage) {
    this.ws = this.connect(uri, onMessage)
  }

  connect(uri: string, onMessage: OnMessage): WebSocket {
    const ws = new WebSocket(uri)

    ws.addEventListener('open', () => {
      if (this.topics.size > 0) {
        ws.send(`subscribe ${[...this.topics].join(' ')}`)
      }
    })

    ws.addEventListener('message', (ev: MessageEvent<string>) => {
      if (ev.data.substring(0, 5) === 'FEED ') {
        const i = ev.data.indexOf(' ', 5)
        const [topic, payload] = [ev.data.substring(5, i), JSON.parse(ev.data.substring(i + 1))]
        onMessage({ topic, payload })
      }
    })

    ws.addEventListener('close', () => {
      this.ws = this.connect(uri, onMessage)
    })

    return ws
  }

  subscribe(topic: string): void {
    if (this.ws.readyState === this.ws.OPEN && !this.topics.has(topic)) {
      this.ws.send(`subscribe ${topic}`)
    }

    this.topics.add(topic)
  }

  refresh(feeds: string[]): void {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(`refresh ${feeds.join(' ')}`)
    }
  }

  command(command: Command): void {
    if (this.ws.readyState === this.ws.OPEN) {
      this.ws.send(`command ${command.sourceId} ${command.name} ${command.args}`)
    }
  }
}

import { Observable, filter, type Subscription, share } from 'rxjs'
import { WSClient } from './WSClient'

const feed: Comment = document.createComment('Apollo Feed')

type Update<T> = {
  topic: string
  payload: T
}

const server = new Observable<Update<any>>(subscriber => {
  const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL ?? `ws://${location.hostname}:3678`
  const wsClient = new WSClient(websocketUrl, ({ topic, payload }) => {
    subscriber.next({ topic, payload })
  })

  feed.addEventListener('subscribe', (ev: Event): void => {
    const topic = (ev as CustomEvent<string>).detail
    wsClient.subscribe(topic)
  })

  feed.addEventListener('request-feeds-refresh', (ev: Event): void => {
    const feeds = (ev as CustomEvent<string[]>).detail
    wsClient.refresh(feeds)
  })

  feed.addEventListener('command', (ev: Event): void => {
    const command = (ev as CustomEvent<{ sourceId: string; name: string; args: string }>).detail
    wsClient.command(command)
  })
})

const updates = server.pipe(share())
const subscribe: <T = any>(topic: string, observer: (update: Update<T>) => void) => Subscription = (topic, observer) => {
  const subs = updates.pipe(filter(update => update.topic === topic)).subscribe(observer)
  subs.add(() => {
    feed.dispatchEvent(new CustomEvent('unsubscribe', { detail: topic }))
  })

  feed.dispatchEvent(new CustomEvent('subscribe', { detail: topic }))
  return subs
}

const sendCommand: (sourceId: string, name: string, args: string) => void = (sourceId, name, args) => {
  feed.dispatchEvent(new CustomEvent('command', { detail: { sourceId, name, args } }))
}

const refreshFeeds = (feeds: string[]): void => {
  feed.dispatchEvent(new CustomEvent('request-feeds-refresh', { detail: feeds }))
}

export { feed, subscribe, sendCommand, refreshFeeds }

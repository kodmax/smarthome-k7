import { fetchFeed } from './fetchFeed'
import { getDefaultWebSocketUrl } from './getDefaultWebSocketUrl'
import { TopicSubscriber } from './types'
import { WSClient } from './WSClient'

const websocketUrl = getDefaultWebSocketUrl()
const subscribers: Map<string, TopicSubscriber<unknown>[]> = new Map()
const recentPayload: Map<string, unknown> = new Map()

const notifySubscribers = (topic: string, payload: unknown): void => {
  recentPayload.set(topic, payload)
  for (const subscriber of subscribers.get(topic) ?? []) {
    subscriber({ topic, payload })
  }
}

const loadFeed = (topic: string): void => {
  void fetchFeed(topic)
    .then(payload => {
      notifySubscribers(topic, payload)
    })
    .catch(() => {
      // Errors are logged in fetchFeed; keep the last known payload.
    })
}

const wsClient = new WSClient(websocketUrl, feedId => {
  if (subscribers.has(feedId)) {
    loadFeed(feedId)
  }
})

const subscribe: (topic: string, subscriber: TopicSubscriber<unknown>) => () => void = (topic, subscriber) => {
  const topicSubscribers = subscribers.get(topic) ?? []
  topicSubscribers.push(subscriber)
  subscribers.set(topic, topicSubscribers)

  if (topicSubscribers.length === 1) {
    wsClient.subscribe(topic)
    loadFeed(topic)
  }

  const payload = recentPayload.get(topic)
  if (payload !== undefined) {
    subscriber({ topic, payload })
  }

  return () => {
    const topicSubscribers = subscribers.get(topic) ?? []
    topicSubscribers.splice(topicSubscribers.indexOf(subscriber), 1)
  }
}

export { subscribe }

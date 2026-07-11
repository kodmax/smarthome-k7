import { TopicSubscriber } from './types'
import { WSClient } from './WSClient'

const websocketUrl = import.meta.env.VITE_WEBSOCKET_URL ?? `ws://${location.hostname}:3678`
const subscribers: Map<string, TopicSubscriber<unknown>[]> = new Map()
const recentPayload: Map<string, unknown> = new Map()

const wsClient = new WSClient(websocketUrl, ({ topic, payload }) => {
  recentPayload.set(topic, payload)
  for (const subscriber of subscribers.get(topic) ?? []) {
    subscriber({ topic, payload })
  }
})

const subscribe: (topic: string, subscriber: TopicSubscriber<unknown>) => () => void = (topic, subscriber) => {
  const topicSubscribers = subscribers.get(topic) ?? []
  topicSubscribers.push(subscriber)
  subscribers.set(topic, topicSubscribers)

  if (topicSubscribers.length === 1) {
    wsClient.subscribe(topic)
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

const sendCommand: (sourceId: string, name: string, args?: string) => void = (sourceId, name, args) => {
  wsClient.command({ sourceId, name, args: args ?? '' })
}

const refreshFeeds = (feeds: string[]): void => {
  wsClient.refresh(feeds)
}

export { subscribe, sendCommand, refreshFeeds }

export type ValueUpdate<T> = [value: T | undefined, updatedAt: number | undefined]

export type Message = {
  payload: unknown
  topic: string
}

export type Command = {
  sourceId: string
  name: string
  args: string
}

export type OnMessage = (msg: Message) => void

export type TopicUpdate<P> = {
  topic: string
  payload: P
}

export type TopicSubscriber<P> = (update: TopicUpdate<P>) => void

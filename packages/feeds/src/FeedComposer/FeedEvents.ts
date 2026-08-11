import EventEmitter from 'events'

export type FeedEventMap = {
  'feed-changed': [feedId: string]
  'data-update': [sourceId: string]
  refresh: [sourceId: string]
  error: [sourceId: string, error: Error, context: string]
  'clients-changed': [count: number]
  'feed-update-sent': [deviceId: string, feedId: string]
}

type EventKey = keyof FeedEventMap

export class FeedEvents {
  private readonly emitter = new EventEmitter()

  public emit<K extends EventKey>(event: K, ...args: FeedEventMap[K]): boolean {
    return this.emitter.emit(event, ...args)
  }

  public on<K extends EventKey>(event: K, listener: (...args: FeedEventMap[K]) => void): this {
    this.emitter.on(event, listener as (...args: unknown[]) => void)
    return this
  }

  public addListener<K extends EventKey>(event: K, listener: (...args: FeedEventMap[K]) => void): this {
    this.emitter.addListener(event, listener as (...args: unknown[]) => void)
    return this
  }

  public removeListener<K extends EventKey>(event: K, listener: (...args: FeedEventMap[K]) => void): this {
    this.emitter.removeListener(event, listener as (...args: unknown[]) => void)
    return this
  }
}

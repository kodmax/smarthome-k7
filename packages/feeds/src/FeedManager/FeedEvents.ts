import EventEmitter from 'events'
import type { DataSourceCommand } from '../DataSource'

export type FeedEventMap = {
  feed: [feedId: string, value: unknown]
  'data-update': [sourceId: string]
  command: [command: DataSourceCommand]
  'clients-changed': [count: number]
  'feeds-request': [feedIds: string[]]
  'feeds-refresh': [feedIds: Iterable<string>]
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

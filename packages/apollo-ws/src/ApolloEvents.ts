import EventEmitter from 'events'
import type { DataSourceCommand } from './DataSource'

export type ApolloEventMap = {
  feed: [feedId: string, value: unknown]
  'sys-log': [priority: number, msg: string, err?: unknown]
  'data-update': [sourceId: string]
  command: [command: DataSourceCommand]
  'feeds-request': [feedIds: string[]]
  'feeds-refresh': [feedIds: Iterable<string>]
}

type EventKey = keyof ApolloEventMap

export class ApolloEvents {
  private readonly emitter = new EventEmitter()

  public emit<K extends EventKey>(event: K, ...args: ApolloEventMap[K]): boolean {
    return this.emitter.emit(event, ...args)
  }

  public on<K extends EventKey>(event: K, listener: (...args: ApolloEventMap[K]) => void): this {
    this.emitter.on(event, listener as (...args: unknown[]) => void)
    return this
  }

  public addListener<K extends EventKey>(event: K, listener: (...args: ApolloEventMap[K]) => void): this {
    this.emitter.addListener(event, listener as (...args: unknown[]) => void)
    return this
  }

  public removeListener<K extends EventKey>(event: K, listener: (...args: ApolloEventMap[K]) => void): this {
    this.emitter.removeListener(event, listener as (...args: unknown[]) => void)
    return this
  }
}

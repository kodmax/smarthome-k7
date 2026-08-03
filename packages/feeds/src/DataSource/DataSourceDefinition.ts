import { FeedEvents } from '../FeedManager'
import { type SourceMetricType } from './types'

export abstract class DataSourceDefinition<T, TCache = T> {
  public constructor(protected readonly feedEvents: FeedEvents) {}

  protected push(content?: T): void {
    this.feedEvents.emit('push', this.getId(), content)
  }

  protected reportError(error: Error, context = 'Push data source update error'): void {
    this.feedEvents.emit('error', this.getId(), error, context)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleCommand(_command: string, _args: string): Promise<void> {
    return Promise.resolve()
  }

  public abstract getId(): string
  public abstract getCacheTTL(): number
  public abstract getData(): Promise<TCache>

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public isCacheValid(_cached: TCache): boolean {
    return true
  }

  public composeContent(cached: TCache): Promise<T> {
    return Promise.resolve(cached as unknown as T)
  }

  public toCacheContent(content: T): TCache {
    return content as unknown as TCache
  }

  public getCron(): string | undefined {
    return undefined
  }

  public maintenance(): Promise<void> {
    return Promise.resolve()
  }

  public isVolatile(): boolean {
    return false
  }

  public getSourceMetricType(): SourceMetricType {
    return 'other'
  }

  public isMetricsEnabled(): boolean {
    return true
  }
}

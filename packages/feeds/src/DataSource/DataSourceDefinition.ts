import { type SourceMetricType } from './types'

export abstract class DataSourceDefinition<T, TCache = T> {
  public constructor(
    protected readonly push: (content?: T) => void | Promise<void>,
    protected readonly reportError: (e: Error) => void,
  ) {}

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

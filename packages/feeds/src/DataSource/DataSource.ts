import type { Logger } from '@repo/logger'
import type { CronJobPolicy } from '@repo/chronos'
import type { CacheEntry, Snapshot } from '../Cache'
import { FeedEvents } from '../FeedComposer'
import type {
  DataSourceCtor,
  DataSourceParams,
  ErrorHandler,
  SourceMetricType,
  DataSourceRefreshObserver,
} from './types'

type DSCT<S> = S extends DataSourceCtor<infer T, infer _TCache> ? T : never

type DSM<S extends Record<string, DataSourceCtor<unknown, unknown>>> = {
  [K in keyof S]: DSCT<S[K]>
}

abstract class DataSource<T, TCache = T> {
  private updating: Promise<T> | undefined

  protected readonly feedEvents: FeedEvents
  private readonly cacheEntry: CacheEntry<TCache>
  private readonly logger: Logger
  private readonly onError: ErrorHandler
  private readonly observeDataSourceRefresh: DataSourceRefreshObserver | undefined

  constructor({ feedEvents, cacheEntry, logger, onError, observeDataSourceRefresh }: DataSourceParams<TCache>) {
    this.feedEvents = feedEvents
    this.cacheEntry = cacheEntry
    this.logger = logger
    this.onError = onError
    this.observeDataSourceRefresh = observeDataSourceRefresh
  }

  public static isVolatile(): boolean {
    return false
  }

  public getId(): string {
    return (this.constructor as DataSourceCtor<T, TCache>).getId()
  }

  public getCacheTTL(): number {
    return (this.constructor as DataSourceCtor<T, TCache>).getCacheTTL()
  }

  public isVolatile(): boolean {
    return (this.constructor as DataSourceCtor<T, TCache>).isVolatile()
  }

  protected reportError(error: Error, context = 'Push data source update error'): void {
    this.feedEvents.emit('error', this.getId(), error, context)
  }

  protected requestRefresh(sourceId: string): void {
    this.feedEvents.emit('refresh', sourceId)
  }

  protected abstract fetchData(): Promise<TCache>

  protected isCacheValid(_cached: TCache): boolean {
    return true
  }

  protected composeContent(cached: TCache): Promise<T> {
    return Promise.resolve(cached as unknown as T)
  }

  public static getCron(): string | undefined {
    return undefined
  }

  public static getCronPolicy(): CronJobPolicy | undefined {
    return undefined
  }

  public maintenance(): Promise<void> {
    return Promise.resolve()
  }

  protected getSourceMetricType(): SourceMetricType {
    return 'other'
  }

  protected isMetricsEnabled(): boolean {
    return true
  }

  public async push(content?: T): Promise<void> {
    if (content !== undefined) {
      await this.cacheEntry.write(content as unknown as TCache)
    }

    this.logger.debug({ sourceId: this.getId() }, 'Push data source')
    this.feedEvents.emit('data-update', this.getId())
  }

  public async getRecentContent(): Promise<T | null> {
    const snapshot = await this.cacheEntry.getSnapshot()
    if (snapshot === null) {
      return null
    }

    return this.composeContent(snapshot.getContent())
  }

  public async ensureContent(): Promise<T> {
    const snapshot = await this.cacheEntry.getSnapshot()
    if (snapshot !== null) {
      return this.composeContent(snapshot.getContent())
    }

    return this.fetchAndCompose().promise
  }

  public async getData(forceRefresh = false): Promise<T> {
    if (this.updating) {
      return this.updating
    }

    if (!forceRefresh && this.getCacheTTL() > 0) {
      const snapshot = await this.getFreshSnapshot()
      if (snapshot !== null) {
        this.logger.debug({ sourceId: this.getId(), cacheHit: true }, 'Cache hit on data source')
        return this.composeContent(snapshot.getContent())
      }
    }

    const fetch = this.fetchAndCompose(forceRefresh)
    const content = await fetch.promise

    if (fetch.initiated) {
      this.feedEvents.emit('data-update', this.getId())
    }

    return content
  }

  private async getFreshSnapshot(): Promise<Snapshot<TCache> | null> {
    if (this.getCacheTTL() <= 0) {
      return null
    }

    const snapshot = await this.cacheEntry.getSnapshot()
    if (snapshot === null) {
      return null
    }

    return this.isCacheValid(snapshot.getContent()) ? snapshot : null
  }

  private fetchAndCompose(forceRefresh = false): { promise: Promise<T>; initiated: boolean } {
    if (this.updating) {
      return { promise: this.updating, initiated: false }
    }

    const sourceId = this.getId()
    const start = Date.now()

    const runFetchData = (): Promise<TCache> => {
      const fetchData = () => this.fetchData()

      if (this.observeDataSourceRefresh !== undefined && this.isMetricsEnabled()) {
        return this.observeDataSourceRefresh(this.getSourceMetricType(), sourceId, fetchData)
      }

      return fetchData()
    }

    const promise = new Promise<T>((resolve, reject) => {
      runFetchData()
        .then(async cached => {
          await this.cacheEntry.write(cached)
          const content = await this.composeContent(cached)
          resolve(content)

          this.logger.info({ sourceId, forceRefresh, durationMs: Date.now() - start }, 'Data source content refreshed')
          this.updating = void 0
        })
        .catch(e => {
          this.logger.warn({ err: e, sourceId }, 'Data source update error')
          this.onError(e, 'Data source update error')
          this.updating = void 0
          reject(e)
        })
    })

    this.updating = promise

    return { promise, initiated: true }
  }
}

export type { DSCT, DSM }
export { DataSource }

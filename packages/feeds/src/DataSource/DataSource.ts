import type { Logger } from '@repo/logger'
import type { CronJobPolicy } from '@repo/chronos'
import type { CacheEntry } from '../Cache'
import { FeedEvents } from '../FeedComposer'
import { withSpan } from '../tracing'
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

    return this.composeContentWithSpan(snapshot.getContent())
  }

  public async ensureContent(): Promise<T> {
    const sourceId = this.getId()

    return withSpan('datasource.ensure_content', { 'datasource.id': sourceId }, async span => {
      const snapshot = await this.cacheEntry.getSnapshot()
      if (snapshot !== null) {
        span.setAttribute('cache.hit', true)
        return this.composeContentWithSpan(snapshot.getContent())
      }

      span.setAttribute('cache.hit', false)
      return this.fetchAndCompose()
    })
  }

  public async refresh(): Promise<T> {
    if (this.updating) {
      return this.awaitInFlightFetch(this.updating)
    }

    return this.fetchAndCompose()
  }

  public async refreshAndNotify(): Promise<T> {
    const content = await this.refresh()
    await this.push()
    return content
  }

  private composeContentWithSpan(cached: TCache): Promise<T> {
    return withSpan('datasource.compose', { 'datasource.id': this.getId() }, () => this.composeContent(cached))
  }

  private awaitInFlightFetch(promise: Promise<T>): Promise<T> {
    return withSpan(
      'datasource.fetch',
      {
        'datasource.id': this.getId(),
        'datasource.awaiting_in_flight': true,
      },
      () => promise,
    )
  }

  private fetchAndCompose(): Promise<T> {
    if (this.updating) {
      return this.awaitInFlightFetch(this.updating)
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

    const promise = withSpan(
      'datasource.fetch',
      {
        'datasource.id': sourceId,
        'datasource.awaiting_in_flight': false,
      },
      () =>
        new Promise<T>((resolve, reject) => {
          runFetchData()
            .then(async cached => {
              await this.cacheEntry.write(cached)
              const content = await this.composeContentWithSpan(cached)
              resolve(content)

              this.logger.debug({ sourceId, durationMs: Date.now() - start }, 'Data source content refreshed')
              this.updating = void 0
            })
            .catch(e => {
              this.logger.warn({ err: e, sourceId }, 'Data source update error')
              this.onError(e, 'Data source update error')
              this.updating = void 0
              reject(e)
            })
        }),
    )

    this.updating = promise

    return promise
  }
}

export type { DSCT, DSM }
export { DataSource }

import type { Logger } from '@repo/logger'
import type { Cache, CacheEntry } from '../Cache'
import { FeedEvents } from '../FeedManager'
import type { ErrorHandler } from './types'
import { DataSourceDefinitionCtor, DataSourceRefreshObserver } from './types'
import { DataSourceDefinition } from './DataSourceDefinition'

type DSCT<S> = S extends new (...args: never[]) => infer I
  ? I extends DataSourceDefinition<infer T, unknown>
    ? T
    : never
  : never

type DSM<S extends Record<string, DataSourceDefinitionCtor<unknown>>> = {
  [K in keyof S]: DSCT<S[K]>
}

type DD = DataSourceDefinition<unknown>

class DataSource<T, TCache = T> {
  private updating: Promise<T> | undefined

  private constructor(
    private definition: DataSourceDefinition<T, TCache>,
    private cacheEntry: CacheEntry<TCache>,
    private vent: FeedEvents,
    private logger: Logger,
    private onError: ErrorHandler,
    private observeDataSourceRefresh: DataSourceRefreshObserver | undefined,
  ) {}

  public static async fromClass<T, TCache = T>(
    sourceClass: DataSourceDefinitionCtor<T, TCache>,
    cache: Cache,
    vent: FeedEvents,
    logger: Logger,
    onError: ErrorHandler,
    observeDataSourceRefresh?: DataSourceRefreshObserver,
  ): Promise<DataSource<T, TCache>> {
    const definition = new sourceClass(vent)

    const cacheEntry = await cache.getEntry<TCache>(definition.isVolatile() ? undefined : definition.getId(), {
      ttlMs: definition.getCacheTTL(),
    })

    return new DataSource(definition, cacheEntry, vent, logger, onError, observeDataSourceRefresh)
  }

  public static async fromClassWithDefinition<T, TCache = T>(
    sourceClass: DataSourceDefinitionCtor<T, TCache>,
    cache: Cache,
    vent: FeedEvents,
    logger: Logger,
    onError: ErrorHandler,
    observeDataSourceRefresh?: DataSourceRefreshObserver,
  ): Promise<[DataSourceDefinition<T, TCache>, DataSource<T, TCache>]> {
    const definition = new sourceClass(vent)

    const cacheEntry = await cache.getEntry<TCache>(definition.isVolatile() ? undefined : definition.getId(), {
      ttlMs: definition.getCacheTTL(),
    })
    const dataSource = new DataSource(definition, cacheEntry, vent, logger, onError, observeDataSourceRefresh)

    return [definition, dataSource]
  }

  public async handleCommand(command: string, args: string): Promise<void> {
    await this.definition.handleCommand(command, args)
  }

  public getCron(): string | undefined {
    return this.definition.getCron()
  }

  public async maintenance(): Promise<void> {
    await this.definition.maintenance()
  }

  public async push(content?: T): Promise<void> {
    if (content !== undefined) {
      await this.cacheEntry.write(this.definition.toCacheContent(content))
    }

    this.logger.debug({ sourceId: this.definition.getId() }, 'Push data source')
    this.vent.emit('data-update', this.definition.getId())
  }

  public async isCacheFresh(): Promise<boolean> {
    if (this.definition.getCacheTTL() <= 0) {
      return false
    }

    const snapshot = await this.cacheEntry.getSnapshot()
    if (snapshot === null) {
      return false
    }

    return this.definition.isCacheValid(snapshot.getContent())
  }

  public getId(): string {
    return this.definition.getId()
  }

  public async getRecentContent(): Promise<T | null> {
    const snapshot = await this.cacheEntry.getSnapshot()
    if (snapshot === null) {
      return null
    }

    return this.definition.composeContent(snapshot.getContent())
  }

  public async ensureContent(): Promise<T> {
    const snapshot = await this.cacheEntry.getSnapshot()
    if (snapshot !== null) {
      return this.definition.composeContent(snapshot.getContent())
    }

    return this.fetchAndCompose().promise
  }

  public async getData(forceRefresh = false): Promise<T> {
    if (this.updating) {
      return this.updating
    } else if (!forceRefresh && this.definition.getCacheTTL() > 0 && (await this.isCacheFresh())) {
      this.logger.debug({ sourceId: this.definition.getId(), cacheHit: true }, 'Cache hit on data source')

      const snapshot = await this.cacheEntry.getSnapshot()
      return this.definition.composeContent(snapshot!.getContent())
    } else {
      const fetch = this.fetchAndCompose(forceRefresh)
      const content = await fetch.promise

      if (fetch.initiated) {
        this.vent.emit('data-update', this.definition.getId())
      }

      return content
    }
  }

  private fetchAndCompose(forceRefresh = false): { promise: Promise<T>; initiated: boolean } {
    if (this.updating) {
      return { promise: this.updating, initiated: false }
    }

    const sourceId = this.definition.getId()
    const start = Date.now()

    const runGetData = (): Promise<TCache> => {
      const fetchData = () => this.definition.getData()

      if (this.observeDataSourceRefresh !== undefined && this.definition.isMetricsEnabled()) {
        return this.observeDataSourceRefresh(this.definition.getSourceMetricType(), sourceId, fetchData)
      }

      return fetchData()
    }

    const promise = new Promise<T>((resolve, reject) => {
      runGetData()
        .then(async cached => {
          await this.cacheEntry.write(cached)
          const content = await this.definition.composeContent(cached)
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

export type { DSCT, DSM, DD }
export { DataSource }

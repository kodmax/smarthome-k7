import type { Logger } from '@repo/logger'
import type { Cache, CacheEntry } from './cache'
import { NoRecentContent } from './Errors'
import { ApolloEvents } from './ApolloEvents'
import { notifyError, type ErrorHandler } from './notifyError'

export abstract class DataSourceDefinition<T, TCache = T> {
  public constructor(
    protected readonly push: (content?: T) => void | Promise<void>,
    protected readonly reportError: (e: Error) => void,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleCommand(_command: string, _args: string, _recentContent?: T): Promise<void> {
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
}

export type DataSourceDefinitionClass<T = unknown, TCache = T> = new (
  push: (content?: T) => void | Promise<void>,
  reportError: (e: Error) => void,
) => DataSourceDefinition<T, TCache>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDataSourceDefinitionClass = DataSourceDefinitionClass<any, any>

type DSCT<S> = S extends new (...args: never[]) => infer I
  ? I extends DataSourceDefinition<infer T, unknown>
    ? T
    : never
  : never

type DSM<S extends Record<string, DataSourceDefinitionClass<unknown>>> = {
  [K in keyof S]: DSCT<S[K]>
}

type DD = DataSourceDefinition<unknown>

export type DataSourceCommand = {
  sourceId: string
  name: string
  args: string
}

class DataSource<T, TCache = T> {
  private updating: Promise<T> | undefined

  private constructor(
    private definition: DataSourceDefinition<T, TCache>,
    private cacheEntry: CacheEntry<TCache>,
    private vent: ApolloEvents,
    private logger: Logger,
    private onError: ErrorHandler,
  ) {}

  public static async fromClass<T, TCache = T>(
    sourceClass: DataSourceDefinitionClass<T, TCache>,
    cache: Cache,
    vent: ApolloEvents,
    logger: Logger,
    onError: ErrorHandler,
  ): Promise<DataSource<T, TCache>> {
    // eslint-disable-next-line prefer-const -- forward ref: push callback needs dataSource before assignment
    let dataSource!: DataSource<T, TCache>
    let sourceId = ''

    const definition = new sourceClass(
      content => dataSource.push(content),
      e => {
        notifyError(logger, onError, 'warn', 'Push data source update error', e, { sourceId })
      },
    )
    sourceId = definition.getId()

    const cacheEntry = await cache.getEntry<TCache>(definition.isVolatile() ? undefined : definition.getId(), {
      ttlMs: definition.getCacheTTL(),
    })
    dataSource = new DataSource(definition, cacheEntry, vent, logger, onError)

    return dataSource
  }

  public async handleCommand(command: string, args: string): Promise<void> {
    let recentContent: T | undefined

    try {
      recentContent = await this.getRecentContent()
    } catch (e) {
      if (!(e instanceof NoRecentContent)) {
        throw e
      }
    }

    await this.definition.handleCommand(command, args, recentContent)
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

  public async getRecentContent(): Promise<T> {
    const snapshot = await this.cacheEntry.getSnapshot()
    if (snapshot === null) {
      throw new NoRecentContent()
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

    const promise = new Promise<T>((resolve, reject) => {
      this.definition
        .getData()
        .then(async cached => {
          await this.cacheEntry.write(cached)
          const content = await this.definition.composeContent(cached)
          resolve(content)

          this.logger.info({ sourceId, forceRefresh, durationMs: Date.now() - start }, 'Data source content refreshed')
          this.updating = void 0
        })
        .catch(e => {
          notifyError(this.logger, this.onError, 'warn', 'Data source update error', e, { sourceId })
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

import type { Cache, CacheEntry } from './cache'
import { NoRecentContent } from './Errors'
import { ApolloEvents } from './ApolloEvents'

export abstract class DataSourceDefinition<T, TCache = T> {
  public constructor(
    protected readonly push: (content?: T) => void,
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
  push: (content?: T) => void,
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
  ) {}

  public static async fromClass<T, TCache = T>(
    sourceClass: DataSourceDefinitionClass<T, TCache>,
    cache: Cache,
    vent: ApolloEvents,
  ): Promise<DataSource<T, TCache>> {
    // eslint-disable-next-line prefer-const -- forward ref: push callback needs dataSource before assignment
    let dataSource!: DataSource<T, TCache>

    const definition = new sourceClass(
      content => void dataSource.push(content),
      e => vent.emit('sys-log', 4, `Push data source <${definition.getId()}> update error: ${e}`, e),
    )

    const cacheEntry = await cache.getEntry<TCache>(definition.isVolatile() ? undefined : definition.getId())
    dataSource = new DataSource(definition, cacheEntry, vent)

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

    this.vent.emit('sys-log', 7, `Push data source <${this.definition.getId()}>`)
    this.vent.emit('data-update', this.definition.getId())
  }

  public isCacheFresh(): boolean {
    const snapshot = this.cacheEntry.getSnapshot()
    if (snapshot === null) {
      return false
    }

    const ageMs = Date.now() - snapshot.getTimestamp()

    const ttl = this.definition.getCacheTTL()

    return ttl > 0 && ageMs <= ttl && this.definition.isCacheValid(snapshot.getContent())
  }

  public getId(): string {
    return this.definition.getId()
  }

  public async getRecentContent(): Promise<T> {
    const snapshot = this.cacheEntry.getSnapshot()
    if (snapshot === null) {
      throw new NoRecentContent()
    }

    return this.definition.composeContent(snapshot.getContent())
  }

  public async getData(forceRefresh = false): Promise<T> {
    if (this.updating) {
      return this.updating
    } else if (!forceRefresh && this.isCacheFresh()) {
      this.vent.emit('sys-log', 7, `Cache hit on data source <${this.definition.getId()}>`)

      const snapshot = this.cacheEntry.getSnapshot()
      return this.definition.composeContent(snapshot!.getContent())
    } else {
      this.updating = new Promise((resolve, reject) => {
        this.definition
          .getData()
          .then(async cached => {
            await this.cacheEntry.write(cached)
            const content = await this.definition.composeContent(cached)
            resolve(content)

            this.vent.emit('sys-log', 4, `Data source <${this.definition.getId()}> content refreshed`)
            this.vent.emit('data-update', this.definition.getId())
            this.updating = void 0
          })
          .catch(e => {
            this.vent.emit('sys-log', 4, `Data source <${this.definition.getId()}> update error: ` + e)
            this.updating = void 0
            reject(e)
          })
      })

      return this.updating
    }
  }
}

export type { DSCT, DSM, DD }
export { DataSource }

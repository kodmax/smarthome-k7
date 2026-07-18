import { Cache, CacheEntry, Snapshot } from './cache'
import { NoRecentContent } from './Errors'
import { ApolloEvents } from './ApolloEvents'

export abstract class DataSourceDefinition<T> {
  public constructor(
    protected readonly push: (content: T) => void,
    protected readonly reportError: (e: Error) => void,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public handleCommand(_command: string, _args: string, _recentContent?: T): Promise<void> {
    return Promise.resolve()
  }

  public abstract getId(): string
  public abstract isSnapshotExpired(snapshot: Snapshot<unknown>): boolean
  public abstract getData(): Promise<T>

  public getCron(): string | undefined {
    return undefined
  }

  public isVolatile(): boolean {
    return false
  }
}

export type DataSourceDefinitionClass<T = unknown> = new (
  push: (content: T) => void,
  reportError: (e: Error) => void,
) => DataSourceDefinition<T>

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AnyDataSourceDefinitionClass = DataSourceDefinitionClass<any>

type DSCT<S> = S extends new (...args: never[]) => infer I
  ? I extends DataSourceDefinition<infer T>
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

class DataSource<T> {
  private updating: Promise<T> | undefined

  private constructor(
    private definition: DataSourceDefinition<T>,
    private cacheEntry: CacheEntry<T>,
    private vent: ApolloEvents,
  ) {}

  public static async fromClass<T>(
    sourceClass: DataSourceDefinitionClass<T>,
    cache: Cache,
    vent: ApolloEvents,
  ): Promise<DataSource<T>> {
    // eslint-disable-next-line prefer-const -- forward ref: push callback needs dataSource before assignment
    let dataSource!: DataSource<T>

    const definition = new sourceClass(
      content => void dataSource.push(content),
      e => vent.emit('sys-log', 4, `Push data source <${definition.getId()}> update error: ${e}`, e),
    )

    const cacheEntry = await cache.getEntry<T>(definition.isVolatile() ? undefined : definition.getId())
    dataSource = new DataSource(definition, cacheEntry, vent)

    return dataSource
  }

  public async handleCommand(command: string, args: string): Promise<void> {
    let recentContent: T | undefined

    try {
      recentContent = this.getRecentContent()
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

  public async push(content: T): Promise<void> {
    await this.cacheEntry.write(content)

    this.vent.emit('sys-log', 7, `Push data source <${this.definition.getId()}>`)
    this.vent.emit('data-update', this.definition.getId())
  }

  public isCacheFresh(): boolean {
    return !this.cacheEntry.isEmpty() && !this.definition.isSnapshotExpired(this.cacheEntry.getSnapshot())
  }

  public getId(): string {
    return this.definition.getId()
  }

  public getRecentContent(): T {
    if (this.cacheEntry.isEmpty()) {
      throw new NoRecentContent()
    }

    return this.cacheEntry.getSnapshot().getContent()
  }

  public async getData(forceRefresh = false): Promise<T> {
    if (this.updating) {
      return this.updating
    } else if (!forceRefresh && this.isCacheFresh()) {
      this.vent.emit('sys-log', 7, `Cache hit on data source <${this.definition.getId()}>`)

      return this.cacheEntry.getSnapshot().getContent()
    } else {
      this.updating = new Promise((resolve, reject) => {
        this.definition
          .getData()
          .then(async content => {
            await this.cacheEntry.write(content as T)
            resolve(content as T)

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

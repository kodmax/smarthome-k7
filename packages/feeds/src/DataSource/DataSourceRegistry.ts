import { DataSource } from './DataSource'
import { DataSourceNotFound } from './Errors'
import { DataSourceFromCtor, DataSourceRefreshObserver, DefinitionFromCtor, RegistryBaseType } from './types'
import { Cache } from '../Cache'
import { FeedEvents } from '../FeedManager'
import { Logger } from '@repo/logger'
import { ErrorHandler } from '../notifyError'
import { DataSourceDefinition } from './DataSourceDefinition'

type DataSourceRegistryParams = {
  cache: Cache
  feedEvents: FeedEvents
  logger: Logger
  onError: ErrorHandler
  observeDataSourceRefresh: DataSourceRefreshObserver
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DataSourceRegistry<T extends RegistryBaseType> {
  private definitions: Map<keyof T, DataSourceDefinition<unknown, unknown>> = new Map()
  private dataSources: Map<keyof T, DataSource<unknown, unknown>> = new Map()

  private cache: Cache
  private feedEvents: FeedEvents
  private logger: Logger
  private onError: ErrorHandler
  private observeDataSourceRefresh: DataSourceRefreshObserver

  constructor(params: DataSourceRegistryParams) {
    ;({
      cache: this.cache,
      feedEvents: this.feedEvents,
      logger: this.logger,
      onError: this.onError,
      observeDataSourceRefresh: this.observeDataSourceRefresh,
    } = params)
  }

  async add<K extends keyof T>(id: K, ctor: T[K]): Promise<void> {
    const [definition, ds] = await DataSource.fromClassWithDefinition(
      ctor,
      this.cache,
      this.feedEvents,
      this.logger,
      this.onError,
      this.observeDataSourceRefresh,
    )
    this.logger.info({ id }, 'Data source registered')
    this.definitions.set(id, definition)
    this.dataSources.set(id, ds)
  }

  getDefinition<K extends keyof T>(id: K): DefinitionFromCtor<T[K]> {
    const definition = this.definitions.get(id)
    if (definition === undefined) {
      throw new DataSourceNotFound()
    }

    return definition as DefinitionFromCtor<T[K]>
  }

  get<K extends keyof T>(id: K): DataSourceFromCtor<T[K]> {
    const ds = this.dataSources.get(id)
    if (ds === undefined) {
      throw new DataSourceNotFound()
    }

    return ds as DataSourceFromCtor<T[K]>
  }

  getByIds<K extends readonly (keyof T)[]>(ids: K): { [key in K[number]]: DataSourceFromCtor<T[key]> } {
    return Object.fromEntries(ids.map(id => [id, this.get(id)])) as {
      [key in K[number]]: DataSourceFromCtor<T[key]>
    }
  }
}

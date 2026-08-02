import { DataSource } from './DataSource'
import { DataSourceNotFound } from './Errors'
import { DataSourceDefinitionCtor, DataSourceFromCtor, DataSourceRefreshObserver, DefinitionFromCtor } from './types'
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

export class DataSourceRegistry<T extends Record<string, DataSourceDefinitionCtor<unknown, unknown>>> {
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
}

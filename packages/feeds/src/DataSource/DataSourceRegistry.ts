import { DataSource } from './DataSource'
import { DataSourceNotFound, DuplicateDataSourceIdError } from './Errors'
import { DataSourceFromCtor, DataSourceRefreshObserver, DefinitionFromCtor, RegistryBaseType } from './types'
import { Cache } from '../Cache'
import { FeedEvents } from '../FeedManager'
import { Logger, readScopedLogLevel } from '@repo/logger'
import { ErrorHandler } from './types'
import { DataSourceDefinition } from './DataSourceDefinition'
import { Chronos } from '@repo/chronos'

const DATA_SOURCES_MAINTENANCE_CRON = '0 3 * * *'

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

  private chronos: Chronos
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
    this.chronos = new Chronos(
      params.logger.child({ component: 'data-source-cron' }, { level: readScopedLogLevel('data-source-cron') }),
    )

    this.chronos.addJob(DATA_SOURCES_MAINTENANCE_CRON, 'data-sources-maintenance', () => this.runMaintenance())
  }

  private async runMaintenance(): Promise<void> {
    for (const ds of this.dataSources.values()) {
      const sourceId = ds.getId()

      try {
        this.logger.debug({ sourceId }, 'Data source maintenance starting')
        const start = Date.now()
        await ds.maintenance()
        this.logger.debug({ sourceId, durationMs: Date.now() - start }, 'Data source maintenance completed')
      } catch (e) {
        this.logger.warn({ err: e, sourceId }, 'Data source maintenance error')
        this.onError(e, 'Data source maintenance error')
      }
    }
  }

  public close(): void {
    this.chronos.stop()
  }

  async add<K extends keyof T>(id: K, ctor: T[K]): Promise<void> {
    if (this.definitions.has(id)) {
      throw new DuplicateDataSourceIdError(id as string)
    }

    const [definition, ds] = await DataSource.fromClassWithDefinition(
      ctor,
      this.cache,
      this.feedEvents,
      this.logger,
      this.onError,
      this.observeDataSourceRefresh,
    )

    const sourceId = ds.getId()
    const cron = ds.getCron()
    if (cron) {
      this.chronos.addJob(cron, sourceId, async () => {
        try {
          this.logger.info({ sourceId, cron }, 'Data source scheduled refresh')
          await ds.getData(true)
        } catch (e) {
          this.logger.warn({ err: e, sourceId }, 'Crontab data source update error')
          this.onError(e, 'Crontab data source update error')
          throw e
        }
      })
    }

    this.logger.info({ id, cron }, 'Data source registered')
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

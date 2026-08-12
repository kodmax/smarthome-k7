import { DataSource } from './DataSource'
import { DataSourceNotFound, DuplicateDataSourceIdError } from './Errors'
import { DataSourceFromCtor, DataSourceRefreshObserver, RegistryBaseType } from './types'
import { Cache } from '../Cache'
import { FeedEvents } from '../FeedComposer'
import { Logger } from '@repo/logger'
import { ErrorHandler } from './types'
import { Chronos, type CronJobPolicy } from '@repo/chronos'

const DATA_SOURCES_MAINTENANCE_CRON = '0 3 * * *'

const DATA_SOURCES_MAINTENANCE_POLICY: CronJobPolicy = {
  retry: { maxAttempts: 3, delaySec: 5 * 60 },
  misfirePolicy: 'run-latest',
}

type DataSourceRegistryParams = {
  cache: Cache
  chronos: Chronos
  feedEvents: FeedEvents
  logger: Logger
  onError: ErrorHandler
  observeDataSourceRefresh: DataSourceRefreshObserver
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class DataSourceRegistry<T extends RegistryBaseType> {
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
      chronos: this.chronos,
      feedEvents: this.feedEvents,
      logger: this.logger,
      onError: this.onError,
      observeDataSourceRefresh: this.observeDataSourceRefresh,
    } = params)

    this.feedEvents.on('refresh', async (sourceId: string) => {
      const ds = [...this.dataSources.values()].find(source => source.getId() === sourceId)
      if (ds === undefined) {
        this.logger.info({ sourceId }, 'Refresh ignored: unknown source')
        return
      }

      try {
        this.logger.debug({ sourceId }, 'Data source refresh requested')
        await ds.refreshAndNotify()
      } catch (e) {
        this.logger.warn({ err: e, sourceId }, 'Refresh data source error')
        this.onError(e, 'Refresh data source error')
      }
    })
  }

  public close(): void {
    this.chronos.stop()
  }

  async add<K extends keyof T>(id: K, ctor: T[K]): Promise<void> {
    if (this.dataSources.has(id)) {
      throw new DuplicateDataSourceIdError(id as string)
    }

    const cacheEntry = await this.cache.getEntry(ctor.isVolatile() ? undefined : ctor.getId(), {
      ttlMs: ctor.getCacheTTL(),
    })

    const ds = new ctor({
      feedEvents: this.feedEvents,
      cacheEntry,
      logger: this.logger,
      onError: this.onError,
      observeDataSourceRefresh: this.observeDataSourceRefresh,
    })

    const sourceId = ds.getId()

    this.chronos.addJob({
      namespace: 'data-source-maintenance',
      id: sourceId,
      cron: DATA_SOURCES_MAINTENANCE_CRON,
      policy: DATA_SOURCES_MAINTENANCE_POLICY,
      script: async () => {
        try {
          this.logger.debug({ sourceId }, 'Data source maintenance starting')
          const start = Date.now()
          await ds.maintenance()
          this.logger.debug({ sourceId, durationMs: Date.now() - start }, 'Data source maintenance completed')
        } catch (e) {
          this.logger.warn({ err: e, sourceId }, 'Data source maintenance error')
          this.onError(e, 'Data source maintenance error')
          throw e
        }
      },
    })

    const cron = ctor.getCron()
    if (cron !== undefined) {
      this.chronos.addJob({
        namespace: 'data-source',
        id: sourceId,
        cron,
        policy: ctor.getCronPolicy(),
        script: async () => {
          try {
            this.logger.debug({ sourceId, cron }, 'Data source scheduled refresh')
            await ds.refreshAndNotify()
          } catch (e) {
            this.logger.warn({ err: e, sourceId }, 'Crontab data source update error')
            this.onError(e, 'Crontab data source update error')
            throw e
          }
        },
      })
    }

    this.logger.info({ id, cron }, 'Data source registered')
    this.dataSources.set(id, ds)
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

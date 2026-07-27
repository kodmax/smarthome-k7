import { readScopedLogLevel } from '@repo/logger'
import type { Cache } from './cache'
import type { DS, Feed, FeedCb, FeedSources, FeedsOptions, SourceDataTypes, SourceRegistration } from './Feeds.types'
import { Chronos } from '@repo/chronos'
import { DataSource, DSCT, AnyDataSourceDefinitionClass } from './DataSource'
import { ApolloEvents } from './ApolloEvents'
import { notifyError } from './notifyError'

import { DuplicateDataSourceIdError, NonErrorException } from './Errors'

export type { FeedsOptions, SourceDataTypes } from './Feeds.types'

const DATA_SOURCES_MAINTENANCE_CRON = '0 3 * * *'

export class Feeds {
  private sourcesById = new Map<string, SourceRegistration>()
  private feeds: Map<string, Feed> = new Map()

  private chronos: Chronos

  public constructor(
    private cache: Cache,
    private vent: ApolloEvents,
    private options: FeedsOptions,
  ) {
    this.chronos = new Chronos(
      options.logger.child({ component: 'feeds-cron' }, { level: readScopedLogLevel('feeds-cron') }),
    )

    this.chronos.addJob(DATA_SOURCES_MAINTENANCE_CRON, 'data-sources-maintenance', () =>
      this.runDataSourcesMaintenance(),
    )

    this.vent.on('feeds-request', feedsIds => {
      for (const id of feedsIds) {
        if (this.feeds.has(id)) {
          this.feed(id).catch(e => {
            notifyError(this.options.logger, this.options.onError, 'warn', `Feed request error <${id}> update error`, e)
          })
        }
      }
    })

    this.vent.on('feeds-refresh', feedsIds => {
      for (const id of feedsIds) {
        if (this.feeds.has(id)) {
          this.refresh(id).catch(e => {
            notifyError(this.options.logger, this.options.onError, 'warn', `Feed request error <${id}> update error`, e)
          })
        }
      }
    })

    this.vent.addListener('data-update', async (sourceId: string) => {
      for (const feed of this.feeds.values()) {
        if (Array.from(feed.sources.values()).find(source => source.getId() === sourceId)) {
          try {
            this.options.logger.debug(`Refreshing feed <${feed.feedId}> due to source <${sourceId}> update`)
            await this.feed(feed.feedId, sourceId)
          } catch (e) {
            notifyError(this.options.logger, this.options.onError, 'warn', `Feed <${feed.feedId}> update error`, e)
          }
        }
      }
    })

    this.vent.on('command', async ev => {
      const registration = this.sourcesById.get(ev.sourceId)
      if (registration === undefined) {
        this.options.logger.info(`Command ignored: unknown data source <${ev.sourceId}>`)
        return
      }

      try {
        await registration.dataSource.handleCommand(ev.name, ev.args)
      } catch (e) {
        notifyError(
          this.options.logger,
          this.options.onError,
          'warn',
          `Data source <${ev.sourceId}> command <${ev.name}> execution error`,
          e,
        )
      }
    })
  }

  private async runDataSourcesMaintenance(): Promise<void> {
    for (const { dataSource } of this.sourcesById.values()) {
      const sourceId = dataSource.getId()

      try {
        this.options.logger.debug(`Data source <${sourceId}> maintenance starting`)
        await dataSource.maintenance()
        this.options.logger.debug(`Data source <${sourceId}> maintenance completed`)
      } catch (e) {
        notifyError(this.options.logger, this.options.onError, 'warn', `Data source <${sourceId}> maintenance error`, e)
      }
    }
  }

  private async getOrCreateDataSource<S extends AnyDataSourceDefinitionClass, T = DSCT<S>>(
    sourceClass: S,
  ): Promise<DataSource<T>> {
    for (const registration of this.sourcesById.values()) {
      if (registration.sourceClass === sourceClass) {
        return registration.dataSource as DataSource<T>
      }
    }

    const dataSource = await DataSource.fromClass(
      sourceClass,
      this.cache,
      this.vent,
      this.options.logger,
      this.options.onError,
    )
    const sourceId = dataSource.getId()

    const existingById = this.sourcesById.get(sourceId)
    if (existingById !== undefined && existingById.sourceClass !== sourceClass) {
      throw new DuplicateDataSourceIdError(sourceId)
    }

    const cron = dataSource.getCron()
    if (cron) {
      this.chronos.addJob(cron, sourceId, async () => {
        try {
          await dataSource.getData(true)
        } catch (e) {
          notifyError(
            this.options.logger,
            this.options.onError,
            'warn',
            `Crontab data source <${sourceId}> update error`,
            e,
          )
          throw e
        }
      })
    }

    this.sourcesById.set(sourceId, { sourceClass, dataSource: dataSource as DS })
    return dataSource
  }

  private async getSourceContent(src: DS, triggeredBy?: string): Promise<unknown> {
    if (triggeredBy === src.getId()) {
      return src.getRecentContent()
    }

    if (triggeredBy === undefined) {
      return src.getData()
    }

    return src.ensureContent()
  }

  private async getData(feed: Feed, triggeredBy?: string): Promise<Record<string, unknown>> {
    const contents: Record<string, unknown> = {}

    await Promise.all(
      Array.from([...feed.sources.entries()]).map(async ([srcName, src]) => {
        contents[srcName] = await this.getSourceContent(src, triggeredBy)
      }),
    )

    return contents
  }

  private async refreshData(feed: Feed): Promise<Record<string, unknown>> {
    const contents: Record<string, unknown> = {}

    await Promise.all(
      Array.from([...feed.sources.entries()]).map(async ([srcName, src]) => {
        contents[srcName] = await src.getData(true)
      }),
    )

    return contents
  }

  private async refresh(feedId: string): Promise<void> {
    const feed = this.feeds.get(feedId)
    if (feed === undefined) {
      throw new Error(`Feed <${feedId}> not registered.`)
    }

    try {
      const content = feed.cb(await this.refreshData(feed))

      this.options.logger.debug(`Feed <${feedId}> update successful.`)
      this.vent.emit('feed', feedId, content)
    } catch (e) {
      if (e instanceof NonErrorException) {
        this.options.logger.info(`Feed <${feedId}> update skipped: ${e.message}`)
        return
      }

      notifyError(this.options.logger, this.options.onError, 'warn', `Feed <${feedId}> callback error`, e)
    }
  }

  private async feed(feedId: string, triggeredBy?: string): Promise<void> {
    const feed = this.feeds.get(feedId)
    if (feed === undefined) {
      throw new Error(`Feed <${feedId}> not registered.`)
    }

    try {
      const content = feed.cb(await this.getData(feed, triggeredBy))

      this.options.logger.debug(`Feed <${feedId}> update successful.`)
      this.vent.emit('feed', feedId, content)
    } catch (e) {
      if (e instanceof NonErrorException) {
        this.options.logger.info(`Feed <${feedId}> update skipped: ${e.message}`)
        return
      }

      notifyError(this.options.logger, this.options.onError, 'warn', `Feed <${feedId}> callback error`, e)
    }
  }

  public async addFeed<R, S extends Record<string, AnyDataSourceDefinitionClass>>(
    feedId: string,
    sourcesDefinitions: S,
    cb?: (content: SourceDataTypes<S>) => R,
  ): Promise<void> {
    const sources: FeedSources = new Map()
    for (const contentName of Object.keys(sourcesDefinitions)) {
      const sourceClass = sourcesDefinitions[contentName]

      sources.set(contentName, await this.getOrCreateDataSource(sourceClass))
    }

    const srcNames = Object.keys(sourcesDefinitions)
    const defaultCallback: FeedCb = content => content[srcNames[0]]
    const callback: FeedCb = cb !== undefined ? content => cb(content as SourceDataTypes<S>) : defaultCallback

    this.feeds.set(feedId, {
      cb: callback,
      sources,
      feedId,
    })
  }

  public close(): void {
    this.chronos.stop()
  }
}

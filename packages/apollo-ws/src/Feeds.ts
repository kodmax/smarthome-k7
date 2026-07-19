import { Chronos } from '@repo/chronos'
import { DataSource, DSCT, AnyDataSourceDefinitionClass } from './DataSource'
import { Cache } from './cache'
import type { DS, Feed, FeedCb, FeedSources, SourceDataTypes, SourceRegistration } from './Feeds.types'
import { ApolloEvents } from './ApolloEvents'

import { DuplicateDataSourceIdError, NonErrorException } from './Errors'

export type { SourceDataTypes } from './Feeds.types'

const DATA_SOURCES_MAINTENANCE_CRON = '0 3 * * *'

export class Feeds {
  private sourcesById = new Map<string, SourceRegistration>()
  private feeds: Map<string, Feed> = new Map()

  private chronos: Chronos

  public constructor(
    private cache: Cache,
    private vent: ApolloEvents,
  ) {
    this.chronos = new Chronos((priority, msg) => this.vent.emit('sys-log', priority, msg))

    this.chronos.addJob(DATA_SOURCES_MAINTENANCE_CRON, 'data-sources-maintenance', () =>
      this.runDataSourcesMaintenance(),
    )

    this.vent.on('feeds-request', feedsIds => {
      for (const id of feedsIds) {
        if (this.feeds.has(id)) {
          this.feed(id).catch(e => {
            this.vent.emit('sys-log', 4, `Feed request error <${id}> update error: ${e}`, e)
          })
        }
      }
    })

    this.vent.on('feeds-refresh', feedsIds => {
      for (const id of feedsIds) {
        if (this.feeds.has(id)) {
          this.refresh(id).catch(e => {
            this.vent.emit('sys-log', 4, `Feed request error <${id}> update error: ${e}`, e)
          })
        }
      }
    })

    this.vent.addListener('data-update', async (sourceId: string) => {
      for (const feed of this.feeds.values()) {
        if (Array.from(feed.sources.values()).find(source => source.getId() === sourceId)) {
          try {
            this.vent.emit('sys-log', 7, `Refreshing feed <${feed.feedId}> due to source <${sourceId}> update`)
            await this.feed(feed.feedId, sourceId)
          } catch (e) {
            this.vent.emit('sys-log', 4, `Feed <${feed.feedId}> update error: ${e}`, e)
          }
        }
      }
    })

    this.vent.on('command', async ev => {
      const registration = this.sourcesById.get(ev.sourceId)
      if (registration === undefined) {
        return
      }

      try {
        await registration.dataSource.handleCommand(ev.name, ev.args)
      } catch (e) {
        this.vent.emit('sys-log', 4, `Data source <${ev.sourceId}> command <${ev.name} execution error: ${e}`, e)
      }
    })
  }

  private async runDataSourcesMaintenance(): Promise<void> {
    for (const { dataSource } of this.sourcesById.values()) {
      const sourceId = dataSource.getId()

      try {
        this.vent.emit('sys-log', 7, `Data source <${sourceId}> maintenance starting`)
        await dataSource.maintenance()
        this.vent.emit('sys-log', 7, `Data source <${sourceId}> maintenance completed`)
      } catch (e) {
        this.vent.emit('sys-log', 4, `Data source <${sourceId}> maintenance error: ${e}`, e)
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

    const dataSource = await DataSource.fromClass(sourceClass, this.cache, this.vent)
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
          this.vent.emit('sys-log', 4, `Crontab data source <${sourceId}> update error: ${e}`, e)
          throw e
        }
      })
    }

    this.sourcesById.set(sourceId, { sourceClass, dataSource: dataSource as DS })
    return dataSource
  }

  private async getData(feed: Feed, triggeredBy?: string): Promise<Record<string, unknown>> {
    const contents: Record<string, unknown> = {}

    await Promise.all(
      Array.from([...feed.sources.entries()]).map(async ([srcName, src]) => {
        contents[srcName] = triggeredBy !== undefined ? await src.getRecentContent() : await src.getData()
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

      this.vent.emit('sys-log', 7, `Feed <${feedId}> update successful.`)
      this.vent.emit('feed', feedId, content)
    } catch (e) {
      if (e instanceof NonErrorException) {
        return
      }

      this.vent.emit('sys-log', 4, `Feed <${feedId}> callback error.`, e)
    }
  }

  private async feed(feedId: string, triggeredBy?: string): Promise<void> {
    const feed = this.feeds.get(feedId)
    if (feed === undefined) {
      throw new Error(`Feed <${feedId}> not registered.`)
    }

    try {
      const content = feed.cb(await this.getData(feed, triggeredBy))

      this.vent.emit('sys-log', 7, `Feed <${feedId}> update successful.`)
      this.vent.emit('feed', feedId, content)
    } catch (e) {
      if (e instanceof NonErrorException) {
        return
      }

      this.vent.emit('sys-log', 4, `Feed <${feedId}> callback error.`, e)
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

import { DataSource, DSCT, DataSourceDefinition } from './DataSource'
import { Chronos } from './chronos'
import { Cache } from './cache'

import EventEmitter from 'events'
import { NonErrorException } from './Errors'

type DS = DataSource<DataSourceDefinition<unknown>>

type SourceDataTypes<S extends Record<string, DataSourceDefinition<unknown>>> = {
  [K in keyof S]: S[K] extends DataSourceDefinition<infer T> ? T : never
}

type FeedSources = Map<string, DataSource<DataSourceDefinition<unknown>>>
type Feed = {
  sources: FeedSources
  cb: (content: SourceDataTypes<Record<string, DataSourceDefinition<unknown>>>) => unknown
  feedId: string
}

export class Feeds implements Feeds {
  private sources: Map<DataSourceDefinition<unknown>, DS> = new Map()
  private feeds: Map<string, Feed> = new Map()

  private chronos: Chronos

  public constructor(
    private cache: Cache,
    private vent: EventEmitter,
  ) {
    this.chronos = new Chronos(vent)

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
  }

  private async addDataSource<S extends DataSourceDefinition<unknown>, T = DSCT<S>>(
    definition: S,
  ): Promise<DataSource<S, T>> {
    const dataSource = new DataSource(
      definition,
      await this.cache.getEntry<T>(definition.volatile === true ? undefined : definition.id),
      this.vent,
    )

    if (definition.cron) {
      this.chronos.addJob(definition.cron, definition.id, async () => {
        try {
          await dataSource.getData(true)
        } catch (e) {
          this.vent.emit('sys-log', 4, `Crontab data source <${definition.id}> update error: ${e}`, e)
          throw e
        }
      })
    }

    this.sources.set(definition, dataSource)
    return dataSource
  }

  private async getData(feed: Feed, triggeredBy?: string): Promise<Record<string, unknown>> {
    const contents: Record<string, unknown> = {}

    await Promise.all(
      Array.from([...feed.sources.entries()]).map(async ([srcName, src]) => {
        contents[srcName] = triggeredBy !== undefined ? src.getRecentContent() : await src.getData()
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

  public async addFeed<R, S extends Record<string, DataSourceDefinition<unknown>>>(
    feedId: string,
    sourcesDefinitions: S,
    cb?: (content: SourceDataTypes<S>) => R,
  ): Promise<void> {
    const sources: FeedSources = new Map()
    for (const contentName of Object.keys(sourcesDefinitions)) {
      const definition = sourcesDefinitions[contentName]

      sources.set(contentName, this.sources.get(definition) ?? (await this.addDataSource(definition)))
    }

    const srcNames = Object.keys(sourcesDefinitions)
    const callback = cb ?? ((content: SourceDataTypes<S>) => content[srcNames[0]])

    this.feeds.set(feedId, {
      cb: callback as unknown as (content: SourceDataTypes<Record<string, DataSourceDefinition<unknown>>>) => unknown,
      sources,
      feedId,
    })
  }
}

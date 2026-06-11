import { DataSource, DSCT, DataSourceDefinition } from './DataSource'
import { Chronos } from './chronos'
import { Cache } from './cache'

import EventEmitter from 'events'

type DS = DataSource<DataSourceDefinition<any>>

type SourceDataTypes<S extends Record<string, DataSourceDefinition<any>>> = {
  [K in keyof S]: S[K] extends DataSourceDefinition<infer T> ? T : never
}

interface Feeds {
  addFeed<R, S extends Record<string, DataSourceDefinition<any>>>(
    feedId: string,
    sourcesDefinitions: S,
    cb?: (content: SourceDataTypes<S>) => R,
  ): Promise<void>
}

type FeedSources = Map<string, DataSource<DataSourceDefinition<any>>>
type Feed = {
  sources: FeedSources
  cb: (content: Record<string, any>) => any
  feedId: string
}

class Feeds implements Feeds {
  private sources: Map<DataSourceDefinition<any>, DS> = new Map()
  private feeds: Map<string, Feed> = new Map()

  private chronos: Chronos

  public constructor(
    private cache: Cache,
    private vent: EventEmitter,
  ) {
    this.vent.on('feeds-request', feedsIds => {
      for (const id of feedsIds) {
        if (this.feeds.has(id)) {
          this.feed(id).catch(e => {
            this.vent.emit('sys-log', 4, `Feed request error <${id}> update error: ${e}`, e)
          })
        }
      }
    })

    this.chronos = new Chronos(vent)
  }

  private async addDataSource<S extends DataSourceDefinition<any>, T = DSCT<S>>(
    definition: S,
  ): Promise<DataSource<S, T>> {
    const dataSource = new DataSource(
      definition,
      await this.cache.getEntry<T>(definition.volatile ? null : definition.id),
      this.vent,
    )

    if (definition.cron) {
      this.chronos.addJob(definition.cron, definition.id, async () => {
        try {
          await dataSource.getData(true)
          this.vent.emit('sys-log', 5, `Crontab data source <${definition.id}> update successful`)
          this.vent.emit('data-update', definition.id)
        } catch (e) {
          this.vent.emit('sys-log', 4, `Crontab data source <${definition.id}> update error: ${e}`, e)
          throw e
        }
      })
    }

    this.sources.set(definition, dataSource)
    return dataSource
  }

  private async getData(feed: Feed, triggeredBy?: string): Promise<Record<string, any>> {
    const contents: Record<string, any> = {}

    await Promise.all(
      Array.from(feed.sources.keys()).map(async srcName => {
        const src = feed.sources.get(srcName)

        contents[srcName] = triggeredBy === src.getId() ? src.getRecentContent() : await src.getData()
      }),
    )

    return contents
  }

  private async feed(feedId: string, triggeredBy?: string): Promise<void> {
    if (this.feeds.has(feedId)) {
      const feed = this.feeds.get(feedId)

      try {
        const content = feed.cb(await this.getData(feed, triggeredBy))

        this.vent.emit('sys-log', 7, `Feed <${feedId}> update successful.`)
        this.vent.emit('feed', feedId, content)
      } catch (e) {
        this.vent.emit('sys-log', 4, `Feed <${feedId}> callback error.`, e)
      }
    } else {
      throw new Error(`Feed <${feedId}> not registered.`)
    }
  }

  public async addFeed<R, S extends Record<string, DataSourceDefinition<any>>>(
    feedId: string,
    sourcesDefinitions: S,
    cb?: (content: SourceDataTypes<S>) => R,
  ): Promise<void> {
    const sources: FeedSources = new Map()
    for (const contentName of Object.keys(sourcesDefinitions)) {
      const definition = sourcesDefinitions[contentName]

      sources.set(
        contentName,
        this.sources.has(definition) ? this.sources.get(definition) : await this.addDataSource(definition),
      )
    }

    const srcNames = Object.keys(sourcesDefinitions)
    this.feeds.set(feedId, {
      cb: cb ?? (srcNames.length === 1 ? contents => contents[srcNames[0]] : contents => contents),
      sources,
      feedId,
    })

    this.vent.addListener('data-update', async (sourceId: string) => {
      if (Array.from(sources.values()).find(source => source.getId() === sourceId)) {
        try {
          this.vent.emit('sys-log', 7, `Refreshing feed <${feedId}> due to source <${sourceId}> update`)
          await this.feed(feedId, sourceId)
        } catch (e) {
          this.vent.emit('sys-log', 4, `Feed <${feedId}> update error: ${e}`, e)
        }
      }
    })
  }
}

export { Feeds }

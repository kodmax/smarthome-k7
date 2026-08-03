import type { DataSourceDataTypes, Feed, FeedSources, FeedsOptions, SourceRegistration } from './types'
import { AnyDataSource } from '../DataSource'
import { FeedEvents } from './FeedEvents'

export type { DataSourceDataTypes, FeedsOptions } from './types'

export class FeedComposer {
  private sourcesById = new Map<string, SourceRegistration>()
  private feeds: Map<string, Feed> = new Map()

  public constructor(
    private feedEvents: FeedEvents,
    private options: FeedsOptions,
  ) {
    this.feedEvents.on('feeds-request', feedsIds => {
      for (const id of feedsIds) {
        if (this.feeds.has(id)) {
          this.feed(id).catch(e => {
            this.options.logger.warn({ err: e, feedId: id }, 'Feed request error')
            this.options.onError(e, 'Feed request error')
          })
        }
      }
    })

    this.feedEvents.on('feeds-refresh', feedsIds => {
      for (const id of feedsIds) {
        if (this.feeds.has(id)) {
          this.refresh(id).catch(e => {
            this.options.logger.warn({ err: e, feedId: id }, 'Feed refresh error')
            this.options.onError(e, 'Feed refresh error')
          })
        }
      }
    })

    this.feedEvents.addListener('data-update', async (sourceId: string) => {
      for (const feed of this.feeds.values()) {
        if (Array.from(feed.sources.values()).find(source => source.getId() === sourceId)) {
          try {
            this.options.logger.debug({ feedId: feed.feedId, sourceId }, 'Refreshing feed due to source update')
            await this.feed(feed.feedId, sourceId)
          } catch (e) {
            this.options.logger.warn({ err: e, feedId: feed.feedId, sourceId }, 'Feed update error')
            this.options.onError(e, 'Feed update error')
          }
        }
      }
    })

    this.feedEvents.on('command', async ev => {
      const registration = this.sourcesById.get(ev.sourceId)
      if (registration === undefined) {
        this.options.logger.info({ sourceId: ev.sourceId, commandName: ev.name }, 'Command ignored: unknown source')
        return
      }

      try {
        await registration.dataSource.handleCommand(ev.name, ev.args)
      } catch (e) {
        this.options.logger.warn(
          { err: e, sourceId: ev.sourceId, commandName: ev.name },
          'Data source command execution error',
        )
        this.options.onError(e, 'Data source command execution error')
      }
    })
  }

  private async getSourceContent(src: SourceRegistration['dataSource'], triggeredBy?: string): Promise<unknown> {
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

  private findSourceKey(feed: Feed, sourceId: string): string | undefined {
    for (const [key, src] of feed.sources) {
      if (src.getId() === sourceId) {
        return key
      }
    }
  }

  private async refresh(feedId: string): Promise<void> {
    const feed = this.feeds.get(feedId)
    if (feed === undefined) {
      throw new Error(`Feed <${feedId}> not registered.`)
    }

    try {
      const content = feed.cb(await this.refreshData(feed))

      this.options.logger.debug({ feedId }, 'Feed update successful')
      this.feedEvents.emit('feed', feedId, content)
    } catch (e) {
      this.options.logger.warn({ err: e, feedId }, 'Feed callback error')
      this.options.onError(e, 'Feed callback error')
    }
  }

  private async feed(feedId: string, triggeredBy?: string): Promise<void> {
    const feed = this.feeds.get(feedId)
    if (feed === undefined) {
      throw new Error(`Feed <${feedId}> not registered.`)
    }

    try {
      const data = await this.getData(feed, triggeredBy)

      if (triggeredBy !== undefined) {
        const triggerKey = this.findSourceKey(feed, triggeredBy)
        if (triggerKey !== undefined && data[triggerKey] === null) {
          this.options.logger.info({ feedId, skipReason: 'No recent content' }, 'Feed update skipped')
          return
        }
      }

      const content = feed.cb(data)

      this.options.logger.debug(
        { feedId, ...(triggeredBy !== undefined ? { triggeredBy } : {}) },
        'Feed update successful',
      )
      this.feedEvents.emit('feed', feedId, content)
    } catch (e) {
      this.options.logger.warn({ err: e, feedId, triggeredBy }, 'Feed callback error')
      this.options.onError(e, 'Feed callback error')
    }
  }

  public async addFeed<R, S extends Record<string, AnyDataSource>>(
    feedId: string,
    dataSources: S,
    cb: (content: DataSourceDataTypes<S>) => R,
  ): Promise<void> {
    const sources: FeedSources = new Map()
    for (const contentName of Object.keys(dataSources)) {
      const ds = dataSources[contentName]
      const sourceId = ds.getId()

      this.sourcesById.set(sourceId, { dataSource: ds })
      sources.set(contentName, ds)
    }

    this.feeds.set(feedId, {
      cb: content => cb(content as DataSourceDataTypes<S>),
      sources,
      feedId,
    })
  }

  public getFeedCount(): number {
    return this.feeds.size
  }
}

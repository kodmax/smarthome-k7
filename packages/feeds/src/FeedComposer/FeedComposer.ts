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
          this.publishFeed(id).catch(e => {
            this.options.logger.warn({ err: e, feedId: id }, 'Feed request error')
            this.options.onError(e, 'Feed request error')
          })
        }
      }
    })

    this.feedEvents.addListener('data-update', async (sourceId: string) => {
      for (const feed of this.feeds.values()) {
        if (this.findSourceKey(feed, sourceId) === undefined) {
          continue
        }

        try {
          this.options.logger.debug({ feedId: feed.feedId, sourceId }, 'Refreshing feed due to source update')
          await this.publishFeed(feed.feedId, sourceId)
        } catch (e) {
          this.options.logger.warn({ err: e, feedId: feed.feedId, sourceId }, 'Feed update error')
          this.options.onError(e, 'Feed update error')
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

  private async collectSourceContents(
    feed: Feed,
    read: (src: SourceRegistration['dataSource']) => Promise<unknown>,
  ): Promise<Record<string, unknown>> {
    const entries = await Promise.all(
      [...feed.sources.entries()].map(async ([srcName, src]) => [srcName, await read(src)] as const),
    )

    return Object.fromEntries(entries)
  }

  private findSourceKey(feed: Feed, sourceId: string): string | undefined {
    return [...feed.sources.entries()].find(([, src]) => src.getId() === sourceId)?.[0]
  }

  private async composeFeedContent(feedId: string, triggeredBy?: string): Promise<unknown | null> {
    const feed = this.feeds.get(feedId)
    if (feed === undefined) {
      throw new Error(`Feed <${feedId}> not registered.`)
    }

    const data = await this.collectSourceContents(feed, src => this.getSourceContent(src, triggeredBy))

    if (triggeredBy !== undefined) {
      const triggerKey = this.findSourceKey(feed, triggeredBy)
      if (triggerKey !== undefined && data[triggerKey] === null) {
        return null
      }
    }

    return feed.cb(data)
  }

  private async publishFeed(feedId: string, triggeredBy?: string): Promise<void> {
    try {
      const content = await this.composeFeedContent(feedId, triggeredBy)
      if (content === null) {
        if (triggeredBy !== undefined) {
          this.options.logger.info({ feedId, skipReason: 'No recent content' }, 'Feed update skipped')
        }
        return
      }

      this.options.logger.debug(
        { feedId, ...(triggeredBy !== undefined ? { triggeredBy } : {}) },
        'Feed update successful',
      )
      this.feedEvents.emit('feed', feedId, content)
    } catch (e) {
      this.options.logger.warn(
        { err: e, feedId, ...(triggeredBy !== undefined ? { triggeredBy } : {}) },
        'Feed callback error',
      )
      this.options.onError(e, 'Feed callback error')
    }
  }

  public async getFeedData(feedId: string): Promise<unknown> {
    const content = await this.composeFeedContent(feedId)
    if (content === null) {
      throw new Error(`Feed <${feedId}> has no content.`)
    }

    return content
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

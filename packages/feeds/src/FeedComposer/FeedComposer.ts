import type { DataSourceDataTypes, Feed, FeedSources, FeedsOptions, SourceRegistration } from './types'
import { AnyDataSource } from '../DataSource'
import { FeedEvents } from './FeedEvents'
import { FeedNotFound } from './Errors'

export type { DataSourceDataTypes, FeedsOptions } from './types'

export class FeedComposer {
  private sourcesById = new Map<string, SourceRegistration>()
  private feeds: Map<string, Feed> = new Map()
  private getFeedDataInFlight = new Map<string, Promise<unknown>>()

  public constructor(
    private feedEvents: FeedEvents,
    private options: FeedsOptions,
  ) {
    this.feedEvents.addListener('data-update', (sourceId: string) => {
      for (const feed of this.feeds.values()) {
        if (this.findSourceKey(feed, sourceId) === undefined) {
          continue
        }

        this.options.logger.debug({ feedId: feed.feedId, sourceId }, 'Feed changed due to source update')
        this.feedEvents.emit('feed-changed', feed.feedId)
      }
    })
  }

  private getRegisteredFeed(feedId: string): Feed {
    const feed = this.feeds.get(feedId)
    if (feed === undefined) {
      throw new FeedNotFound(feedId)
    }

    return feed
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

  /** REST GET — read from cache when available; fetch without emitting data-update on miss. */
  private async composeFeedForRead(feedId: string): Promise<unknown> {
    const feed = this.getRegisteredFeed(feedId)
    const data = await this.collectSourceContents(feed, src => src.ensureContent())

    return feed.cb(data)
  }

  public getFeedData(feedId: string): Promise<unknown> {
    const existing = this.getFeedDataInFlight.get(feedId)
    if (existing !== undefined) {
      return existing
    }

    const composition = this.runGetFeedData(feedId)
    this.getFeedDataInFlight.set(feedId, composition)
    void composition
      .finally(() => {
        if (this.getFeedDataInFlight.get(feedId) === composition) {
          this.getFeedDataInFlight.delete(feedId)
        }
      })
      .catch(() => {
        // Rejection is handled by callers awaiting `composition`.
      })

    return composition
  }

  private runGetFeedData(feedId: string): Promise<unknown> {
    return this.composeFeedForRead(feedId)
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

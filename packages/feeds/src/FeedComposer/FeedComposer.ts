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

  /** Subscribe / GET — every source uses getData(); always returns payload or throws. */
  private async composeFeedOnSubscribe(feedId: string): Promise<unknown> {
    const feed = this.getRegisteredFeed(feedId)
    const data = await this.collectSourceContents(feed, src => src.getData())

    return feed.cb(data)
  }

  /**
   * Push / data-update — trigger source reads cache only; siblings use ensureContent().
   * Returns undefined when the trigger source has no recent content (skip broadcast).
   */
  private async composeFeedOnSourceUpdate(feedId: string, triggeredBy: string): Promise<unknown | undefined> {
    const feed = this.getRegisteredFeed(feedId)
    const data = await this.collectSourceContents(feed, src =>
      triggeredBy === src.getId() ? src.getRecentContent() : src.ensureContent(),
    )

    const triggerKey = this.findSourceKey(feed, triggeredBy)
    if (triggerKey !== undefined && data[triggerKey] === null) {
      return undefined
    }

    return feed.cb(data)
  }

  private async publishFeed(feedId: string, triggeredBy?: string): Promise<void> {
    try {
      const content =
        triggeredBy === undefined
          ? await this.composeFeedOnSubscribe(feedId)
          : await this.composeFeedOnSourceUpdate(feedId, triggeredBy)

      if (content === undefined) {
        this.options.logger.info({ feedId, skipReason: 'No recent content' }, 'Feed update skipped')
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
    return this.composeFeedOnSubscribe(feedId)
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

import { FeedManager } from '@repo/feeds'
import { TorrentSource } from '@/data-sources'

export const addTopTorrentsFeed = (feeds: FeedManager): Promise<void> =>
  feeds.addFeed('top-torrents', { torrents: TorrentSource })

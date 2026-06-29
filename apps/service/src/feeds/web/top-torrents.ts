import { Feeds } from '@repo/apollo-ws'
import { torrents } from '@/data-sources'

export const addTopTorrentsFeed = (feeds: Feeds): Promise<void> => feeds.addFeed('top-torrents', { torrents })

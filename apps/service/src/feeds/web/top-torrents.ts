import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addTopTorrentsFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => feeds.registerFeed('top-torrents', dataSources.getByIds(['torrents']), ({ torrents }) => torrents)

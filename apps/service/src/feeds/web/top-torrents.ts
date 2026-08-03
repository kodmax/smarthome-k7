import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addTopTorrentsFeed = (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => feeds.addFeed('top-torrents', dataSources.getByIds(['torrents']), ({ torrents }) => torrents)

import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addCvFeed = (feeds: FeedManager, dataSources: DataSourceRegistry<DataSourceRegistryType>): Promise<void> =>
  feeds.registerFeed('cv', dataSources.getByIds(['cv']), ({ cv }) => cv)

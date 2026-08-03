import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addCvFeed = (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => feeds.addFeed('cv', dataSources.getByIds(['cv']), ({ cv }) => cv)

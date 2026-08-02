import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addTransmissionFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.registerFeed('transmission', dataSources.getByIds(['transmission']), ({ transmission }) => transmission)

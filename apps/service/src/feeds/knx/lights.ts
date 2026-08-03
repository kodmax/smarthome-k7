import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addLightsFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => feeds.addFeed('home.lights', dataSources.getByIds(['homeLights']), ({ homeLights }) => homeLights)

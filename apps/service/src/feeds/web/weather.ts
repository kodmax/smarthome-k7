import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addWeatherFeed = (feeds: FeedManager, dataSources: DataSourceRegistry<DataSourceRegistryType>): void => {
  feeds.registerFeed('weather', dataSources.getByIds(['weather']), ({ weather }) => weather)
}

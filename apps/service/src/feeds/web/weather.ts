import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addWeatherFeed = (feeds: FeedComposer, dataSources: DataSourceRegistry<DataSourceRegistryType>): void => {
  feeds.addFeed('weather', dataSources.getByIds(['weather']), ({ weather }) => weather)
}

import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addHomeAirQualityHumidityFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed(
    'home.air-quality.humidity',
    dataSources.getByIds(['humidityHourly', 'humidityReading']),
    ({ humidityReading, humidityHourly }) => ({
      reading: humidityReading,
      history: humidityHourly,
    }),
  )

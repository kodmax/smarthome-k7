import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addHomeAirQualityCo2Feed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed(
    'home.air-quality.co2',
    dataSources.getByIds(['co2Hourly', 'co2Reading', 'co2Alert']),
    ({ co2Reading, co2Hourly, co2Alert }) => ({
      reading: co2Reading,
      history: co2Hourly,
      alert: co2Alert,
    }),
  )

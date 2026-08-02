import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addJobMarketInsightFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.registerFeed(
    'job-market-insight',
    dataSources.getByIds(['jobMarketInsight']),
    ({ jobMarketInsight }) => jobMarketInsight,
  )

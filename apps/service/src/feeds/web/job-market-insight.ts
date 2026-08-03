import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addJobMarketInsightFeed = (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed(
    'job-market-insight',
    dataSources.getByIds(['jobMarketInsight']),
    ({ jobMarketInsight }) => jobMarketInsight,
  )

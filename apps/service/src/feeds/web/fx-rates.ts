import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { FxRatesFeed } from '@repo/types'
import { DataSourceRegistryType } from '@/data-sources'

export const addFxRatesFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed('fx-rates', dataSources.getByIds(['cnbcForex']), ({ cnbcForex }): FxRatesFeed => cnbcForex)

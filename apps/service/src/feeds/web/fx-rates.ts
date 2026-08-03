import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { FxRatesFeed } from '@repo/types'
import { DataSourceRegistryType } from '@/data-sources'

export const addFxRatesFeed = (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed('fx-rates', dataSources.getByIds(['cnbcForex']), ({ cnbcForex }): FxRatesFeed => cnbcForex)

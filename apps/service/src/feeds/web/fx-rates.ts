import { FeedManager } from '@repo/feeds'
import { FxRatesFeed } from '@repo/types'
import { CnbcForexSource } from '@/data-sources'

export const addFxRatesFeed = (feeds: FeedManager): Promise<void> =>
  feeds.addFeed('fx-rates', { cnbcForex: CnbcForexSource }, ({ cnbcForex }): FxRatesFeed => cnbcForex)

import { Feeds } from '@repo/apollo-ws'
import { FxRatesFeed } from '@repo/types'
import { CnbcForexSource } from '@/data-sources'

export const addFxRatesFeed = (feeds: Feeds): Promise<void> =>
  feeds.addFeed('fx-rates', { cnbcForex: CnbcForexSource }, ({ cnbcForex }): FxRatesFeed => cnbcForex)

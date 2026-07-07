import { MarketInfo, MarketStatus } from '@repo/types'

export const getEffectiveMarketStatus = (marketInfo: MarketInfo, now: number): MarketStatus => {
  const preMarketOffset = marketInfo.preMarketOpeningTime - marketInfo.marketOpeningTime
  const preMarketStart = marketInfo.marketOpeningTime + preMarketOffset

  if (now >= marketInfo.marketOpeningTime && now < marketInfo.marketClosingTime) {
    return 'Open'
  }

  if (now < marketInfo.marketOpeningTime) {
    return now >= preMarketStart ? 'Pre-Market' : 'Closed'
  }

  return 'After-Hours'
}

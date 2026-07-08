import { MarketInfo, MarketStatus } from '@repo/types'

export const getEffectiveMarketStatus = (marketInfo: MarketInfo, now: number): MarketStatus => {
  if (now >= marketInfo.marketOpeningTime && now < marketInfo.marketClosingTime) {
    return 'Open'
  }

  if (now < marketInfo.marketOpeningTime) {
    return now >= marketInfo.preMarketOpeningTime ? 'Pre-Market' : 'Closed'
  }

  if (now < marketInfo.afterHoursMarketClosingTime) {
    return 'After-Hours'
  }

  return 'Closed'
}

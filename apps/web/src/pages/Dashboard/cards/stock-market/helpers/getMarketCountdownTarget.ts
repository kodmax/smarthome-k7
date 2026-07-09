import { MarketInfo } from '@repo/types'
import { getEffectiveSessionTimes } from './getEffectiveSessionTimes'
import { MarketCountdownTarget } from './types'

export const getMarketCountdownTarget = (marketInfo: MarketInfo, now: number): MarketCountdownTarget => {
  const { openingTime, closingTime } = getEffectiveSessionTimes(marketInfo, now)

  if (now < openingTime) {
    return { target: openingTime, prefix: 'Otwarcie za' }
  }

  if (now <= closingTime) {
    return { target: closingTime, prefix: 'Zamknięcie za' }
  }

  return { target: openingTime, prefix: 'Otwarcie za' }
}

export const getMarketCountdownRemaining = (marketInfo: MarketInfo, now: number): number => {
  const { target } = getMarketCountdownTarget(marketInfo, now)

  return Math.max(0, target - now)
}

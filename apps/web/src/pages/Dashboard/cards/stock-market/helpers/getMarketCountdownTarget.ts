import { MarketInfo } from '@repo/types'
import { getEffectiveSessionTimes } from './getEffectiveSessionTimes'
import { MarketCountdownTarget } from './types'

type MarketCountdownLabels = {
  openingIn: string
  closingIn: string
}

export const getMarketCountdownTarget = (
  marketInfo: MarketInfo,
  now: number,
  labels: MarketCountdownLabels,
): MarketCountdownTarget => {
  const { openingTime, closingTime } = getEffectiveSessionTimes(marketInfo, now)

  if (now < openingTime) {
    return { target: openingTime, prefix: labels.openingIn }
  }

  if (now <= closingTime) {
    return { target: closingTime, prefix: labels.closingIn }
  }

  return { target: openingTime, prefix: labels.openingIn }
}

export const getMarketCountdownRemaining = (
  marketInfo: MarketInfo,
  now: number,
  labels: MarketCountdownLabels,
): number => {
  const { target } = getMarketCountdownTarget(marketInfo, now, labels)

  return Math.max(0, target - now)
}

import { MarketInfo } from '@repo/types'
import { getNextSessionOpeningTime } from './getNextSessionOpeningTime'
import { EffectiveSessionTimes } from './types'

export const getEffectiveSessionTimes = (marketInfo: MarketInfo, now: number): EffectiveSessionTimes => {
  if (now <= marketInfo.marketClosingTime) {
    return {
      openingTime: marketInfo.marketOpeningTime,
      closingTime: marketInfo.marketClosingTime,
    }
  }

  const nextOpeningTime = getNextSessionOpeningTime(marketInfo)
  const sessionDuration = marketInfo.marketClosingTime - marketInfo.marketOpeningTime

  return {
    openingTime: nextOpeningTime,
    closingTime: nextOpeningTime + sessionDuration,
  }
}

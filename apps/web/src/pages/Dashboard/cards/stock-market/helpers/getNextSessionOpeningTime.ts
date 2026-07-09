import { MarketInfo } from '@repo/types'
import { getOpeningTimeOfDayOffset } from './marketTime'

export const getNextSessionOpeningTime = (marketInfo: MarketInfo): number =>
  marketInfo.nextTradeDate + getOpeningTimeOfDayOffset(marketInfo.marketOpeningTime)

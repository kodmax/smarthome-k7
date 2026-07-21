import { TickerData } from '@repo/types'
import { getPriceTargetChange30d, PRICE_TARGET_CHANGE_MIN_ABS } from '../cells/getPriceTargetChange30d'

export const sortPriceTargetChangeTickers = (tickers: TickerData[]): TickerData[] =>
  tickers
    .filter(item => {
      const change = getPriceTargetChange30d(item)
      return change !== null && Math.abs(change) >= PRICE_TARGET_CHANGE_MIN_ABS
    })
    .sort((a, b) => (getPriceTargetChange30d(b) ?? 0) - (getPriceTargetChange30d(a) ?? 0))

import { TickerData } from '@repo/types'

export const PRICE_TARGET_CHANGE_MIN_ABS = 0.03

export const getPriceTargetChange30d = (ticker: TickerData): number | null =>
  ticker.quoteSummary.priceTargetChange.last30days

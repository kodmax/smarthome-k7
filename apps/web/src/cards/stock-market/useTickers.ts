import { StockMarketFeed } from '@repo/types'
import { TickerDetails } from './types'
import { useMemo } from 'react'

export const useTickers = (feed: StockMarketFeed | undefined): TickerDetails[] | undefined => {
  return useMemo<TickerDetails[] | undefined>(
    () =>
      feed !== undefined
        ? feed.tickers
            .map((data): TickerDetails => {
              const priceTarget =
                data.quoteSummary.priceTarget.last7days ??
                data.quoteSummary.priceTarget.last30days ??
                data.price.oneYearTarget
              const eg = (priceTarget / data.price.lastTradePrice - 1) * 100

              return {
                priceTarget,
                eg,
                data,
              }
            })
            .sort((a, b) => b.eg - a.eg)
        : undefined,
    [feed],
  )
}

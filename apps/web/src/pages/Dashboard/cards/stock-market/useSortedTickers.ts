import { StockMarketFeed, TickerData } from '@repo/types'
import { useMemo } from 'react'

export const useSortedTickers = (feed: StockMarketFeed | undefined): TickerData[] | undefined => {
  return useMemo<TickerData[] | undefined>(
    () =>
      feed !== undefined
        ? feed.tickers
            .filter(item => item.statistics.forwardEPS !== null)
            .sort((a, b) => (b.price.eg ?? 0) - (a.price.eg ?? 0))
        : undefined,
    [feed],
  )
}

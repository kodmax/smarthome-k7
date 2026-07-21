import { StockMarketFeed, TickerData } from '@repo/types'
import { useMemo } from 'react'
import { type StockQuotesFilter } from '../stockQuotesFilter'
import { sortEarningsSoonTickers } from './sortEarningsSoonTickers'
import { sortHighUpsideTickers } from './sortHighUpsideTickers'
import { sortLowForwardPETickers } from './sortLowForwardPETickers'

export const useSortedTickers = (
  feed: StockMarketFeed | undefined,
  filter: StockQuotesFilter,
): TickerData[] | undefined => {
  return useMemo<TickerData[] | undefined>(() => {
    if (feed === undefined) {
      return undefined
    }

    switch (filter) {
      case 'high-upside':
        return sortHighUpsideTickers(feed.tickers)
      case 'low-forward-pe':
        return sortLowForwardPETickers(feed.tickers)
      case 'earnings-soon':
        return sortEarningsSoonTickers(feed.tickers)
    }
  }, [feed, filter])
}

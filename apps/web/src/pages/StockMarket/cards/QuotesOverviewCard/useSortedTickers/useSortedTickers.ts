import { StockMarketFeed, TickerData } from '@repo/types'
import { useMemo } from 'react'
import { type QuotesOverviewView } from '../quotesOverviewViews'
import { sortPriceTargetChangeTickers } from './sortPriceTargetChangeTickers'
import { sortEarningsSoonTickers } from './sortEarningsSoonTickers'
import { sortHighUpsideTickers } from './sortHighUpsideTickers'
import { sortLowForwardPETickers } from './sortLowForwardPETickers'

export const useSortedTickers = (
  feed: StockMarketFeed | undefined,
  view: QuotesOverviewView,
): TickerData[] | undefined => {
  return useMemo<TickerData[] | undefined>(() => {
    if (feed === undefined) {
      return undefined
    }

    switch (view) {
      case 'high-upside':
        return sortHighUpsideTickers(feed.tickers)
      case 'low-forward-pe':
        return sortLowForwardPETickers(feed.tickers)
      case 'earnings-soon':
        return sortEarningsSoonTickers(feed.tickers)
      case 'price-target-change':
        return sortPriceTargetChangeTickers(feed.tickers)
    }
  }, [feed, view])
}

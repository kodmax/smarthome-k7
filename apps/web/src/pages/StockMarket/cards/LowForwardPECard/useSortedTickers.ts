import { calcPEAtPT } from '@/pages/Dashboard/cards/stock-market/Ticker/cells/calcPEAtPT'
import { StockMarketFeed, TickerData } from '@repo/types'
import { useMemo } from 'react'

export const useSortedTickers = (feed: StockMarketFeed | undefined): TickerData[] | undefined => {
  return useMemo<TickerData[] | undefined>(
    () =>
      feed !== undefined
        ? feed.tickers
            .filter(item => {
              const forwardPEatPT = calcPEAtPT(item).forwardPEAtPriceTarget
              return forwardPEatPT !== null && forwardPEatPT <= 25
            })
            .sort((a, b) => {
              const aPEatPT = calcPEAtPT(a)
              const bPEatPT = calcPEAtPT(b)
              const aFactor =
                (aPEatPT.forwardPEAtPriceTarget ?? Infinity) / (aPEatPT.trailingPEAtPriceTarget ?? Infinity)
              const bFactor =
                (bPEatPT.forwardPEAtPriceTarget ?? Infinity) / (bPEatPT.trailingPEAtPriceTarget ?? Infinity)
              return aFactor - bFactor
            })
        : undefined,
    [feed],
  )
}

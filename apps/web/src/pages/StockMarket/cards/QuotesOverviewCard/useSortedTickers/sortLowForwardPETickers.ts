import { calcPEAtPT } from '@/pages/Dashboard/cards/stock-market/Ticker/cells/calcPEAtPT'
import { TickerData } from '@repo/types'

export const sortLowForwardPETickers = (tickers: TickerData[]): TickerData[] =>
  tickers
    .filter(item => {
      const forwardPEatPT = calcPEAtPT(item).forwardPEAtPriceTarget
      return forwardPEatPT !== null && forwardPEatPT <= 25
    })
    .sort((a, b) => {
      const aPEatPT = calcPEAtPT(a)
      const bPEatPT = calcPEAtPT(b)
      const aFactor = (aPEatPT.forwardPEAtPriceTarget ?? Infinity) / (aPEatPT.trailingPEAtPriceTarget ?? Infinity)
      const bFactor = (bPEatPT.forwardPEAtPriceTarget ?? Infinity) / (bPEatPT.trailingPEAtPriceTarget ?? Infinity)
      return aFactor - bFactor
    })

import { type TickerData } from '@repo/types'

export type PEAtPTValues = {
  trailingPEAtPriceTarget: number | null
  forwardPEAtPriceTarget: number | null
}

export function calcPEAtPT(ticker: TickerData): PEAtPTValues {
  const trailingPE =
    ticker.statistics.trailingEPS > 0 ? ticker.price.lastTradePrice / ticker.statistics.trailingEPS : null

  const trailingPEAtPriceTarget =
    trailingPE !== null && ticker.price.priceTarget !== null
      ? (trailingPE * ticker.price.priceTarget) / ticker.price.lastTradePrice
      : null

  const forwardPEAtPriceTarget =
    ticker.statistics.forwardEPS !== null && ticker.statistics.forwardEPS > 0 && ticker.price.priceTarget !== null
      ? ticker.price.priceTarget / ticker.statistics.forwardEPS
      : null

  return { trailingPEAtPriceTarget, forwardPEAtPriceTarget }
}

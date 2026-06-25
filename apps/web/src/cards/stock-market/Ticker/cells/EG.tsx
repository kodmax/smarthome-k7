import { FC } from 'react'
import { Data } from '../styled'
import { TickerData } from '@repo/types'

export const EG: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const trailingPE =
    ticker.statistics.trailingEPS > 0 ? ticker.price.lastTradePrice / ticker.statistics.trailingEPS : null

  const trailingPEAtPriceTarget =
    trailingPE !== null && ticker.price.priceTarget !== null
      ? (trailingPE * ticker.price.priceTarget) / ticker.price.lastTradePrice
      : null

  return (
    <Data>
      {ticker.price.eg !== null ? ticker.price.eg.toFixed(0) : '--'}% (
      {ticker.price.priceTarget !== null ? ticker.price.priceTarget.toFixed(2) : '--'}
      {' / '}
      {trailingPEAtPriceTarget !== null ? trailingPEAtPriceTarget.toFixed(0) : '--'})
    </Data>
  )
}

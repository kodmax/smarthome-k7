import { FC } from 'react'
import { Data } from '../styled'
import { TickerData } from '@repo/types'

export const PEAtPT: FC<{ ticker: TickerData }> = ({ ticker }) => {
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

  return (
    <Data sx={{ fontFamily: 'monospace', textAlign: 'center' }}>
      {trailingPEAtPriceTarget !== null ? trailingPEAtPriceTarget.toFixed(0) : '--'}
      {' → '}
      {forwardPEAtPriceTarget !== null ? forwardPEAtPriceTarget.toFixed(0) : '--'}
    </Data>
  )
}

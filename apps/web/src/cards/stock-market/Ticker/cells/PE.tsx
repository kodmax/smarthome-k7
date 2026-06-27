import { FC } from 'react'
import { Data } from '../styled'
import { TickerData } from '@repo/types'

export const PE: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  if (!zoom) {
    return null
  }

  const forwardPE =
    ticker.statistics.forwardEPS !== null && ticker.statistics.forwardEPS > 0
      ? ticker.price.lastTradePrice / ticker.statistics.forwardEPS
      : null

  const trailingPE =
    ticker.statistics.trailingEPS > 0 ? ticker.price.lastTradePrice / ticker.statistics.trailingEPS : null

  return (
    <Data sx={{ fontFamily: 'monospace', textAlign: 'right' }}>
      {trailingPE !== null ? trailingPE.toFixed(0) : '--'} → {forwardPE !== null ? forwardPE.toFixed(0) : '--'}{' '}
    </Data>
  )
}

import { FC, useContext } from 'react'
import { Data } from '../styled'
import { ZoomContext } from '../../../../apollo-card/ZoomCurtain'
import { TickerData } from '@repo/types'

export const PE: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const zoom = useContext(ZoomContext)

  if (!zoom.active) {
    return null
  }

  const forwardPE =
    ticker.statistics.forwardEPS !== null && ticker.statistics.forwardEPS > 0 && ticker.price.priceTarget !== null
      ? ticker.price.lastTradePrice / ticker.statistics.forwardEPS
      : null

  const trailingPE =
    ticker.statistics.trailingEPS > 0 ? ticker.price.lastTradePrice / ticker.statistics.trailingEPS : null

  return (
    <Data>
      {trailingPE !== null ? trailingPE.toFixed(0) : '--'} → {forwardPE !== null ? forwardPE.toFixed(0) : '--'}{' '}
    </Data>
  )
}

import { FC, useContext } from 'react'
import { Data } from '../styled'
import { TickerData } from '@repo/types'
import { ZoomContext } from '../../../../apollo-card/ZoomCurtain'

export const PriceTarget: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const zoom = useContext(ZoomContext)

  if (!zoom.active) {
    return null
  }

  return (
    <Data sx={{ fontFamily: 'monospace' }}>
      {ticker.price.priceTarget !== null ? ticker.price.priceTarget.toFixed(2) : '--'}
    </Data>
  )
}

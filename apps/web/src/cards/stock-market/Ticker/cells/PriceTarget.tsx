import { FC } from 'react'
import { Data } from '../styled'
import { TickerData } from '@repo/types'

export const PriceTarget: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  if (!zoom) {
    return null
  }

  return (
    <Data sx={{ fontFamily: 'monospace' }}>
      {ticker.price.priceTarget !== null ? ticker.price.priceTarget.toFixed(2) : '--'}
    </Data>
  )
}

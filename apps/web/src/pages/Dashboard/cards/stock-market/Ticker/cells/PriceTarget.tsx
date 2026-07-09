import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'
import { TickerData } from '@repo/types'

export const PriceTarget: FC<{ ticker: TickerData; zoom: boolean }> = ({ ticker, zoom }) => {
  if (!zoom) {
    return null
  }

  return (
    <ApolloTableCell sx={{ fontFamily: 'monospace' }}>
      {ticker.price.priceTarget !== null ? ticker.price.priceTarget.toFixed(2) : '--'}
    </ApolloTableCell>
  )
}

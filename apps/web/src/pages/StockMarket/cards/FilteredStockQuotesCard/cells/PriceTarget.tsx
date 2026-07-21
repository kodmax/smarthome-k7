import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'
import { TickerData } from '@repo/types'

export const PriceTarget: FC<{ ticker: TickerData }> = ({ ticker }) => {
  return (
    <ApolloTableCell sx={{ fontFamily: 'monospace' }}>
      {ticker.price.priceTarget !== null ? ticker.price.priceTarget.toFixed(2) : '--'}
    </ApolloTableCell>
  )
}

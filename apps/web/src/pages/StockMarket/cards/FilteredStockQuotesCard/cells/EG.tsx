import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'
import { TickerData } from '@repo/types'

export const EG: FC<{ ticker: TickerData }> = ({ ticker }) => {
  return (
    <ApolloTableCell sx={{ fontFamily: 'monospace' }}>
      {ticker.price.eg !== null ? ticker.price.eg.toFixed(0) : '--'}%
    </ApolloTableCell>
  )
}

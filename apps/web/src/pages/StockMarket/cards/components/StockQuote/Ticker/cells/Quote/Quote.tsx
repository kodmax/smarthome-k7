import { TickerData } from '@repo/types'
import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'

export const Quote: FC<{ ticker: TickerData }> = ({ ticker }) => {
  return (
    <ApolloTableCell sx={{ fontFamily: 'monospace', width: '6em' }}>
      {ticker.price.lastTradePrice.toFixed(2)}
    </ApolloTableCell>
  )
}

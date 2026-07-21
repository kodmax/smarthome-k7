import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'
import { TickerData } from '@repo/types'

export const PE: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const trailingPE =
    ticker.statistics.trailingEPS > 0 ? ticker.price.lastTradePrice / ticker.statistics.trailingEPS : null

  return (
    <ApolloTableCell sx={{ fontFamily: 'monospace', width: '3em' }}>
      {trailingPE !== null ? trailingPE.toFixed(0) : '--'}
    </ApolloTableCell>
  )
}

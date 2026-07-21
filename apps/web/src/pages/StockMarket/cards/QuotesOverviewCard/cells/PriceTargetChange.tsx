import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'
import { TickerData } from '@repo/types'
import { PriceChange } from '../../components/StockQuote/Ticker/styled'
import { getPriceTargetChange30d } from './getPriceTargetChange30d'

export const PriceTargetChange: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const change = getPriceTargetChange30d(ticker)

  if (change === null) {
    return <ApolloTableCell sx={{ fontFamily: 'monospace' }}>--</ApolloTableCell>
  }

  const direction = change > 0 ? 'up' : change < 0 ? 'down' : 'none'

  return (
    <ApolloTableCell sx={{ fontFamily: 'monospace' }}>
      <PriceChange dir={direction}>
        {direction === 'up' ? '+' : ''}
        {(change * 100).toFixed(2)}%
      </PriceChange>
    </ApolloTableCell>
  )
}

import { TickerData } from '@repo/types'
import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'
import { PriceChange } from '../../styled'

export const Change: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const priceChangeDirection = +ticker.price.netChange > 0 ? 'up' : +ticker.price.netChange < 0 ? 'down' : 'none'

  return (
    <ApolloTableCell sx={{ fontFamily: 'monospace', width: '6em' }}>
      <PriceChange dir={priceChangeDirection}>
        {priceChangeDirection === 'up' ? '+' : ''}
        {ticker.price.percentageChange.toFixed(2)}%
      </PriceChange>
    </ApolloTableCell>
  )
}

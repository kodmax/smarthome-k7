import { Box } from '@mui/system'
import { TickerData } from '@repo/types'
import { FC } from 'react'
import { ApolloTableCell } from '@/card-components'
import { PriceChange } from '../../styled'

export const Quote: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const priceChangeDirection = +ticker.price.netChange > 0 ? 'up' : +ticker.price.netChange < 0 ? 'down' : 'none'

  return (
    <ApolloTableCell sx={{ display: 'flex', justifyContent: 'flex-start' }}>
      <Box sx={{ fontFamily: 'monospace', flex: '0 0 5.5em' }}>{ticker.price.lastTradePrice.toFixed(2)} </Box>
      <Box sx={{ fontFamily: 'monospace', flex: '0 0 4.5em' }}>
        <PriceChange dir={priceChangeDirection}>
          {priceChangeDirection === 'up' ? '+' : ''}
          {ticker.price.percentageChange.toFixed(2)}%
        </PriceChange>
      </Box>
    </ApolloTableCell>
  )
}

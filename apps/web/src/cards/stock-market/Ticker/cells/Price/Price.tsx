import { Box } from '@mui/system'
import { TickerData } from '@repo/types'
import { FC } from 'react'
import { Data, PriceChange } from '../../styled'
import { MarketStatusIcon } from './MarketStatusIcon'

export const Price: FC<{ ticker: TickerData }> = ({ ticker }) => {
  const priceChangeDirection = +ticker.price.netChange > 0 ? 'up' : +ticker.price.netChange < 0 ? 'down' : 'none'

  return (
    <Data sx={{ display: 'flex' }}>
      <Box sx={{ flex: '0 0 1em' }}>
        <MarketStatusIcon marketStatus={ticker.exchange.status} />
      </Box>
      <Box sx={{ fontFamily: 'monospace', flex: '0 0 5em' }}>{ticker.price.lastTradePrice.toFixed(2)} </Box>
      <Box sx={{ fontFamily: 'monospace', flex: '0 0 4.5em' }}>
        <PriceChange dir={priceChangeDirection}>
          {priceChangeDirection === 'up' ? '+' : ''}
          {ticker.price.percentageChange.toFixed(2)}%
        </PriceChange>
      </Box>
    </Data>
  )
}

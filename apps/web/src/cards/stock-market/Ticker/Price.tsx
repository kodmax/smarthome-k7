import { Box } from '@mui/system'
import { TickerData } from '@repo/types'
import { FC } from 'react'
import { PriceChange } from './styled'

export const Price: FC<{ price: TickerData['price'] }> = ({ price }) => {
  const priceChangeDirection = +price.netChange > 0 ? 'up' : +price.netChange < 0 ? 'down' : 'none'

  return (
    <Box sx={{ fontFamily: 'monospace ' }}>
      {price.lastTradePrice} <PriceChange dir={priceChangeDirection}>{price.percentageChange}</PriceChange>
    </Box>
  )
}

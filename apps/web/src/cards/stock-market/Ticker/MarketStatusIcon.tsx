import { Bedtime, Circle, WbSunny } from '@mui/icons-material'
import { StockMarketStatus } from '@repo/types'
import { FC } from 'react'

export const MarketStatusIcon: FC<{ marketStatus: StockMarketStatus }> = ({ marketStatus }) => {
  switch (marketStatus) {
    case 'Open':
      return <Circle sx={{ fontSize: '1em', color: 'green' }} />

    case 'After-Hours':
      return <Bedtime sx={{ fontSize: '1em' }} />

    case 'Pre-Market':
      return <WbSunny sx={{ fontSize: '1em' }} />

    case 'Closed':
      return <Circle sx={{ fontSize: '1em', color: 'gray' }} />

    default:
      return <>{marketStatus}</>
  }
}

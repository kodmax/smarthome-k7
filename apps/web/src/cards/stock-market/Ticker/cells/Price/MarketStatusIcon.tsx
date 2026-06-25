import { Bedtime, Circle, WbSunny } from '@mui/icons-material'
import { ExchangeStatus } from '@repo/types'
import { FC } from 'react'

export const MarketStatusIcon: FC<{ marketStatus: ExchangeStatus }> = ({ marketStatus }) => {
  switch (marketStatus) {
    case 'Open':
      return <Circle sx={{ fontSize: '1em', color: 'green', verticalAlign: 'middle' }} />

    case 'After-Hours':
      return <Bedtime sx={{ fontSize: '1em', verticalAlign: 'middle' }} />

    case 'Pre-Market':
      return <WbSunny sx={{ fontSize: '1em', verticalAlign: 'middle' }} />

    case 'Closed':
      return <Circle sx={{ fontSize: '1em', color: 'gray', verticalAlign: 'middle' }} />

    default:
      return <>{marketStatus}</>
  }
}

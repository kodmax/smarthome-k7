import { type FC } from 'react'
import { DayWeatherForecast } from '@repo/types'
import { useMediaQuery } from '@mui/system'
import { DaySmall, DaySmallWrapper } from './DaySmall'
import { DayLarge, DayLargeWrapper } from './DayLarge'

export const Day: FC<{ forecast?: DayWeatherForecast; dayLabel?: string }> = ({ forecast, dayLabel }) => {
  const isSmallScreen = useMediaQuery('(max-width: 599px')

  return isSmallScreen ? (
    forecast !== undefined && dayLabel !== undefined ? (
      <DaySmall forecast={forecast} dayLabel={dayLabel} />
    ) : (
      <DaySmallWrapper />
    )
  ) : forecast !== undefined && dayLabel !== undefined ? (
    <DayLarge forecast={forecast} dayLabel={dayLabel} />
  ) : (
    <DayLargeWrapper />
  )
}

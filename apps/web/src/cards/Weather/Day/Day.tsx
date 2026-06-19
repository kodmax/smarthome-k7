import { type FC } from 'react'
import { DayWeatherForecast } from '@repo/types'
import { useMediaQuery } from '@mui/system'
import { DaySmall, DaySmallWrapper } from './DaySmall'
import { DayLarge, DayLargeWrapper } from './DayLarge'

export const Day: FC<{ forecast?: DayWeatherForecast }> = ({ forecast }) => {
  const isSmallScreen = useMediaQuery('(max-width: 599px')

  return isSmallScreen ? (
    forecast !== undefined ? (
      <DaySmall forecast={forecast} />
    ) : (
      <DaySmallWrapper />
    )
  ) : forecast !== undefined ? (
    <DayLarge forecast={forecast} />
  ) : (
    <DayLargeWrapper />
  )
}

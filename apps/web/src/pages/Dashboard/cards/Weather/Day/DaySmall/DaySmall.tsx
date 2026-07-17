import { type FC } from 'react'
import WeatherIcon from '../../WeatherIcon'
import { DayWrapper } from './styled'
import { DayWeatherForecast } from '@repo/types'
import { Box } from '@mui/material'
import { WEATHER_ICON_SIZE } from '../../HourlyWeatherForecast/styled'

export const DaySmall: FC<{ forecast: DayWeatherForecast; dayLabel: string }> = ({ forecast, dayLabel }) => {
  return (
    <DayWrapper>
      <Box sx={{ fontSize: '0.8em' }}>{dayLabel}</Box>
      <Box sx={{ fontSize: '0.8em' }}>{forecast.date}</Box>
      <WeatherIcon icon={forecast.icon} width={`${WEATHER_ICON_SIZE}px`} height={`${WEATHER_ICON_SIZE}px`} />
      <Box sx={{ fontSize: '0.8em' }}>{Number(forecast.temp.high).toFixed(0)} °C</Box>
      <Box sx={{ fontSize: '0.7em' }}>{Number(forecast.temp.low).toFixed(0)} °C</Box>
    </DayWrapper>
  )
}

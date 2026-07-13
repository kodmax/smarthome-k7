import { type FC } from 'react'
import WeatherIcon from '../../WeatherIcon'
import { DayWrapper } from './styled'
import { DayWeatherForecast } from '@repo/types'
import { Box } from '@mui/material'

export const DaySmall: FC<{ forecast: DayWeatherForecast; dayLabel: string }> = ({ forecast, dayLabel }) => {
  return (
    <DayWrapper>
      <WeatherIcon icon={forecast.icon} width='28px' height='28px' />
      <Box sx={{ fontSize: '0.7em' }}>
        {Number(forecast.temp.low).toFixed(0)}/{Number(forecast.temp.high).toFixed(0)} °C
      </Box>
      <Box sx={{ fontSize: '0.7em' }}>{dayLabel}</Box>
      <Box sx={{ fontSize: '0.7em' }}>{forecast.date}</Box>
    </DayWrapper>
  )
}

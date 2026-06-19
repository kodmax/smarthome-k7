import { icons } from '@repo/weather-icons'
import { type FC } from 'react'
import { DayWrapper, Icon } from './styled'
import { DayWeatherForecast } from '@repo/types'
import { Box } from '@mui/material'

export const DaySmall: FC<{ forecast: DayWeatherForecast }> = ({ forecast }) => {
  return (
    <DayWrapper>
      <Icon style={{ backgroundImage: `url("${icons[forecast.icon]}")` }} />
      <Box sx={{ fontSize: '0.7em' }}>
        {Number(forecast.temp.low).toFixed(0)}/{Number(forecast.temp.high).toFixed(0)} °C
      </Box>
      <Box sx={{ fontSize: '0.7em' }}>{forecast.dow}</Box>
      <Box sx={{ fontSize: '0.7em' }}>{forecast.date}</Box>
    </DayWrapper>
  )
}

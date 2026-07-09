import { type FC } from 'react'
import WeatherIcon from '../../WeatherIcon'
import { DayWrapper } from './styled'
import { DayWeatherForecast } from '@repo/types'

export const DayLarge: FC<{ forecast: DayWeatherForecast }> = ({ forecast }) => {
  return (
    <DayWrapper>
      <div style={{ paddingRight: '1em' }}>
        <WeatherIcon icon={forecast.icon} width='2.5em' height='2.5em' />
      </div>
      <div style={{ textAlign: 'left' }}>
        <div>
          {Number(forecast.temp.low).toFixed(0)} – {Number(forecast.temp.high).toFixed(0)} °C
        </div>
        <div style={{ fontSize: '0.7em' }}>
          {forecast.dow} {forecast.date}
        </div>
      </div>
    </DayWrapper>
  )
}

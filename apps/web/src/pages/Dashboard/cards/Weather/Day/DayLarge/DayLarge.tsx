import { type FC } from 'react'
import { designTokens } from '@repo/design-tokens'
import WeatherIcon from '../../WeatherIcon'
import { DayWrapper } from './styled'
import { DayWeatherForecast } from '@repo/types'

const { space } = designTokens
const WEATHER_ICON_SIZE = 32

export const DayLarge: FC<{ forecast: DayWeatherForecast; dayLabel: string }> = ({ forecast, dayLabel }) => {
  return (
    <DayWrapper>
      <div style={{ paddingRight: `${space[3]}px` }}>
        <WeatherIcon icon={forecast.icon} width={`${WEATHER_ICON_SIZE}px`} height={`${WEATHER_ICON_SIZE}px`} />
      </div>
      <div style={{ textAlign: 'left' }}>
        <div>
          {Number(forecast.temp.low).toFixed(0)} – {Number(forecast.temp.high).toFixed(0)} °C
        </div>
        <div style={{ fontSize: '0.7em' }}>
          {dayLabel} {forecast.date}
        </div>
      </div>
    </DayWrapper>
  )
}

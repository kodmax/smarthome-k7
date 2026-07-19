import { type FC } from 'react'
import WeatherIcon from '../../WeatherIcon'
import { WEATHER_ICON_SIZE } from '../styled'
import { WeatherIconSlot } from './styled'

export const HourWeatherIcon: FC<{ icon: string }> = ({ icon }) => (
  <WeatherIconSlot>
    <WeatherIcon icon={icon} width={`${WEATHER_ICON_SIZE}px`} height={`${WEATHER_ICON_SIZE}px`} />
  </WeatherIconSlot>
)

import { type FC } from 'react'
import { WeatherIcon as WeatherCardIcon } from '@repo/assets'
import WeatherIcon from '../WeatherIcon'
import { ApolloCard } from '@/apollo-card'
import { useFeed } from '@repo/feed-client'
import { HourWeatherForecast, WeatherFeed } from '@repo/types'
import {
  ForecastRow,
  HourColumn,
  IconSlot,
  PRECIP_ICON_SIZE,
  PrecipRow,
  RowText,
  ScrollArea,
  SunText,
  WEATHER_ICON_SIZE,
} from './styled'

export const HourlyWeatherForecast: FC<Record<string, never>> = () => {
  const forecast = useFeed<WeatherFeed>('weather')

  return (
    <ApolloCard cardId='hourly-weather-forecast' title='Prognoza godzinowa' icon={WeatherCardIcon}>
      <ScrollArea>
        <ForecastRow>
          {forecast?.hourly.map((fc: HourWeatherForecast) => (
            <HourColumn key={fc.hour}>
              <RowText>{fc.hour}:00</RowText>
              <IconSlot>
                <WeatherIcon icon={fc.icon} width={`${WEATHER_ICON_SIZE}px`} height={`${WEATHER_ICON_SIZE}px`} />
              </IconSlot>
              <RowText>{Number(fc.temp).toFixed(0)} °C</RowText>
              <PrecipRow>
                <WeatherIcon
                  icon={fc.precipIcon}
                  glow='soft'
                  width={`${PRECIP_ICON_SIZE}px`}
                  height={`${PRECIP_ICON_SIZE}px`}
                />
                <span>{fc.precip}</span>
              </PrecipRow>
              <SunText>{Number(fc.sun.altitude).toFixed(0)}°</SunText>
            </HourColumn>
          ))}
        </ForecastRow>
      </ScrollArea>
    </ApolloCard>
  )
}

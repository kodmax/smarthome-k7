import { type FC } from 'react'
import { WeatherIcon as WeatherCardIcon } from '@repo/assets'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { HourWeatherForecast, WeatherFeed } from '@repo/types'
import { ForecastRow, ScrollArea } from './styled'
import { Hour } from './Hour'

export const HourlyWeatherForecast: FC<Record<string, never>> = () => {
  const zoom = useZoom('hourly-weather-forecast')
  const forecast = useFeed<WeatherFeed>('weather')

  return (
    <ApolloCard cardId='hourly-weather-forecast' title='Prognoza godzinowa' icon={WeatherCardIcon}>
      <ScrollArea>
        <ForecastRow>
          {forecast?.hourly.map((fc: HourWeatherForecast) => (
            <Hour key={`${fc.date}-${fc.hour}`} fc={fc} zoom={zoom} />
          ))}
        </ForecastRow>
      </ScrollArea>
    </ApolloCard>
  )
}

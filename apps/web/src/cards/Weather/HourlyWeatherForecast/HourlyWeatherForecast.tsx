import { type FC } from 'react'
import { WeatherIcon as WeatherCardIcon } from '@repo/assets'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { useFeed } from '@repo/feed-client'
import { HourWeatherForecast, WeatherFeed } from '@repo/types'
import { ForecastRow, ScrollArea } from './styled'
import { Hour } from './Hour'

export const HourlyWeatherForecast: FC<Record<string, never>> = () => {
  const forecast = useFeed<WeatherFeed>('weather')

  return (
    <ApolloCard cardId='hourly-weather-forecast' title='Prognoza godzinowa' icon={WeatherCardIcon}>
      <ScrollArea>
        <ForecastRow>
          <ZoomContext.Consumer>
            {zoom =>
              forecast?.hourly.map((fc: HourWeatherForecast) => <Hour key={fc.hour} fc={fc} zoom={zoom.active} />)
            }
          </ZoomContext.Consumer>
        </ForecastRow>
      </ScrollArea>
    </ApolloCard>
  )
}

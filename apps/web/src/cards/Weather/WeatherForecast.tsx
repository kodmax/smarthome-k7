import banner from './card-banners/weather-forecast-long.jpg'
import { Day, DayPlaceholder } from './Day'
import ApolloCard from '../../apollo-card/ApolloCard'
import { useFeed } from '@repo/feed-client'
import { type FC } from 'react'
import { DayWrapper, WeekContainer } from './WeekView'
import { DayWeatherForecast, WeatherFeed } from '@repo/types'

const dows = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'niedz.']

export const WeatherForecast: FC<Record<string, never>> = () => {
  const feed = useFeed<WeatherFeed>('weather')

  if (feed === undefined) {
    const placeholders = new Array(15).fill(undefined)
    return (
      <ApolloCard cardId='weather-forecast' banner={banner} height={7} allowZoom={false}>
        <div style={{ paddingTop: '0.5em', paddingBottom: '1em' }}>
          <WeekContainer>
            {placeholders.map((_, i) => (
              <DayPlaceholder key={i} />
            ))}
          </WeekContainer>
        </div>
      </ApolloCard>
    )
  }

  const passedDays = new Array(dows.indexOf(feed.forecast[0].dow)).fill(undefined)

  return (
    <ApolloCard cardId='weather-forecast' banner={banner} height={7} allowZoom={false}>
      <div style={{ paddingTop: '0.5em', paddingBottom: '1em' }}>
        <WeekContainer>
          {passedDays.map((_, i) => (
            <DayWrapper key={i} />
          ))}
          {feed.forecast.map((day: DayWeatherForecast) => (
            <Day key={day.date} forecast={day} />
          ))}
        </WeekContainer>
      </div>
    </ApolloCard>
  )
}

import { Day, WeekContainer } from './Day'
import { WeatherIcon as WeatherCardIcon } from '@repo/assets'
import { ApolloCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { type FC } from 'react'
import { DayWeatherForecast, WeatherFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import {} from './Day/styled'

const dows = ['pon.', 'wt.', 'śr.', 'czw.', 'pt.', 'sob.', 'niedz.']

export const WeatherForecast: FC<Record<string, never>> = () => {
  const feed = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()
  const title = t.dashboard.weatherForecast.title

  if (feed === undefined) {
    const placeholders = new Array(15).fill(undefined)
    return (
      <ApolloCard cardId='weather-forecast' title={title} icon={WeatherCardIcon} height={7} allowZoom={false}>
        <div style={{ paddingTop: '0.5em', paddingBottom: '1em' }}>
          <WeekContainer>
            {placeholders.map((_, i) => (
              <Day key={i} />
            ))}
          </WeekContainer>
        </div>
      </ApolloCard>
    )
  }

  const passedDays = new Array(dows.indexOf(feed.forecast[0].dow)).fill(undefined)

  return (
    <ApolloCard cardId='weather-forecast' title={title} icon={WeatherCardIcon} height={7} allowZoom={false}>
      <div style={{ paddingTop: '0.5em', paddingBottom: '1em' }}>
        <WeekContainer>
          {passedDays.map((_, i) => (
            <Day key={i} />
          ))}
          {feed.forecast.map((day: DayWeatherForecast) => (
            <Day key={day.date} forecast={day} />
          ))}
        </WeekContainer>
      </div>
    </ApolloCard>
  )
}

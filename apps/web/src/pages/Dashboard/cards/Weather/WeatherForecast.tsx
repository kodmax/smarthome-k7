import { Day, WeekContainer } from './Day'
import { WeatherIcon as WeatherCardIcon } from '@repo/assets'
import { ApolloCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { type FC } from 'react'
import { DayWeatherForecast, WeatherFeed } from '@repo/types'
import { formatForecastDayLabel, mondayBasedWeekdayIndex, parseForecastDate, useTranslations } from '@/i18n'

export const WeatherForecast: FC<Record<string, never>> = () => {
  const feed = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()
  const title = t.dashboard.weatherForecast.title

  if (feed === undefined) {
    const placeholders = new Array(15).fill(undefined)
    return (
      <ApolloCard cardId='weather-forecast' title={title} icon={WeatherCardIcon} height={7} allowZoom={false}>
        <WeekContainer>
          {placeholders.map((_, i) => (
            <Day key={i} />
          ))}
        </WeekContainer>
      </ApolloCard>
    )
  }

  const firstDayIndex = mondayBasedWeekdayIndex(parseForecastDate(feed.forecast[0].date))
  const passedDays = new Array(firstDayIndex).fill(undefined)

  return (
    <ApolloCard cardId='weather-forecast' title={title} icon={WeatherCardIcon} height={7} allowZoom={false}>
      <WeekContainer>
        {passedDays.map((_, i) => (
          <Day key={i} />
        ))}
        {feed.forecast.map((day: DayWeatherForecast) => (
          <Day key={day.date} forecast={day} dayLabel={formatForecastDayLabel(day.date, t)} />
        ))}
      </WeekContainer>
    </ApolloCard>
  )
}

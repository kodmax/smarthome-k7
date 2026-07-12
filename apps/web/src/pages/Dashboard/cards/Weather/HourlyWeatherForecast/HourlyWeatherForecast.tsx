import { type FC } from 'react'
import { WeatherIcon as WeatherCardIcon } from '@repo/assets'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { HourWeatherForecast, WeatherFeed } from '@repo/types'
import { formatIsoWeekdayShort, useTranslations } from '@/i18n'
import { ForecastRow, ScrollArea } from './styled'
import { Hour } from './Hour'

export const HourlyWeatherForecast: FC<Record<string, never>> = () => {
  const zoom = useZoom('hourly-weather-forecast')
  const forecast = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()

  return (
    <ApolloCard cardId='hourly-weather-forecast' title={t.dashboard.hourlyWeatherForecast.title} icon={WeatherCardIcon}>
      <ScrollArea>
        <ForecastRow>
          {forecast?.hourly.map((fc: HourWeatherForecast) => (
            <Hour key={`${fc.date}-${fc.hour}`} fc={fc} zoom={zoom} weekdayLabel={formatIsoWeekdayShort(fc.date, t)} />
          ))}
        </ForecastRow>
      </ScrollArea>
    </ApolloCard>
  )
}

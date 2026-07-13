import { type FC } from 'react'
import { RainIcon, ThermometerSunIcon, UVIcon, WeatherIcon as WeatherCardIcon, WindIcon } from '@repo/assets'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { HourWeatherForecast, WeatherFeed } from '@repo/types'
import { formatIsoWeekdayShort, useTranslations } from '@/i18n'
import { CardHeadingHints, CardHintIcon, formatHintLine } from '../../../hints'
import {
  maxHourlyPrecipPercent,
  maxHourlyTemp,
  maxHourlyUv,
  maxHourlyWindSpeed,
  shouldShowHourlyHighUvHint,
  shouldShowHourlyHotHint,
  shouldShowHourlyRainHint,
  shouldShowHourlyWindHint,
} from '../hourlyWeatherHints'
import { ForecastRow, ScrollArea } from './styled'
import { Hour } from './Hour'

export const HourlyWeatherForecast: FC<Record<string, never>> = () => {
  const zoom = useZoom('hourly-weather-forecast')
  const forecast = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()
  const labels = t.dashboard.hourlyWeatherForecast
  const weatherLabels = t.dashboard.weather
  const hintExplanations = t.dashboard.hintExplanations
  const hourly = forecast?.hourly

  const showRain = shouldShowHourlyRainHint(hourly)
  const showHot = shouldShowHourlyHotHint(hourly)
  const showWind = shouldShowHourlyWindHint(hourly)
  const showHighUv = shouldShowHourlyHighUvHint(hourly)

  return (
    <ApolloCard
      cardId='hourly-weather-forecast'
      title={labels.title}
      icon={WeatherCardIcon}
      height={6}
      headingInfo={
        showRain || showHot || showWind || showHighUv ? (
          <CardHeadingHints>
            {showRain ? (
              <CardHintIcon
                Icon={RainIcon}
                variant='info'
                title={labels.rainChance}
                description={formatHintLine(hintExplanations.hourlyRain.line1, String(maxHourlyPrecipPercent(hourly)))}
              />
            ) : null}
            {showHot ? (
              <CardHintIcon
                Icon={ThermometerSunIcon}
                variant='warning'
                title={weatherLabels.hotOutdoor}
                description={formatHintLine(hintExplanations.hourlyHotOutdoor.line1, maxHourlyTemp(hourly).toFixed(0))}
              />
            ) : null}
            {showWind ? (
              <CardHintIcon
                Icon={WindIcon}
                variant='info'
                title={weatherLabels.strongWind}
                description={formatHintLine(
                  hintExplanations.hourlyStrongWind.line1,
                  maxHourlyWindSpeed(hourly).toFixed(0),
                )}
              />
            ) : null}
            {showHighUv ? (
              <CardHintIcon
                Icon={UVIcon}
                variant='warning'
                title={weatherLabels.highUv}
                description={formatHintLine(hintExplanations.hourlyHighUv.line1, maxHourlyUv(hourly).toFixed(1))}
              />
            ) : null}
          </CardHeadingHints>
        ) : undefined
      }
    >
      <ScrollArea>
        <ForecastRow>
          {hourly?.map((fc: HourWeatherForecast) => (
            <Hour key={`${fc.date}-${fc.hour}`} fc={fc} zoom={zoom} weekdayLabel={formatIsoWeekdayShort(fc.date, t)} />
          ))}
        </ForecastRow>
      </ScrollArea>
    </ApolloCard>
  )
}

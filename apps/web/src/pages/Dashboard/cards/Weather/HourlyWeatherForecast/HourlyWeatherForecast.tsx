import { type FC } from 'react'
import { CoolingIcon, ThermometerSunIcon, UVIcon, WeatherIcon as WeatherCardIcon, WindIcon } from '@repo/assets'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { HourWeatherForecast, WeatherFeed } from '@repo/types'
import { formatIsoWeekdayShort, useTranslations } from '@/i18n'
import { CardHeadingHints, CardHintIcon, formatHintLine } from '@/app/hints'
import {
  maxHourlyPrecipPercentForType,
  maxHourlyTemp,
  maxHourlyUv,
  maxHourlyWindSpeed,
  minHourlyTemp,
  shouldShowAnyHourlyPrecipHint,
  shouldShowHourlyFrostHint,
  shouldShowHourlyHighUvHint,
  shouldShowHourlyHotHint,
  shouldShowHourlyPrecipHint,
  shouldShowHourlyWindHint,
} from '../hourlyWeatherHints'
import { PRECIP_HINT_TYPES, precipHintVariant, precipTypeIcon } from '../precipTypeIcons'
import { ForecastRow, ScrollArea } from './styled'
import { Hour } from './Hour'

const hourlyPrecipHintKey = {
  rain: 'hourlyRain',
  snow: 'hourlySnow',
  hail: 'hourlyHail',
  sleet: 'hourlySleet',
  ice: 'hourlyIce',
  mixed: 'hourlyMixed',
} as const

const hourlyPrecipTitleKey = {
  rain: 'rainChance',
  snow: 'snowChance',
  hail: 'hailChance',
  sleet: 'sleetChance',
  ice: 'iceChance',
  mixed: 'mixedChance',
} as const

export const HourlyWeatherForecast: FC<Record<string, never>> = () => {
  const zoom = useZoom('hourly-weather-forecast')
  const forecast = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()
  const labels = t.dashboard.hourlyWeatherForecast
  const weatherLabels = t.dashboard.weather
  const hintExplanations = t.dashboard.hintExplanations
  const hourly = forecast?.hourly

  const showPrecip = shouldShowAnyHourlyPrecipHint(hourly)
  const showHot = shouldShowHourlyHotHint(hourly)
  const showWind = shouldShowHourlyWindHint(hourly)
  const showHighUv = shouldShowHourlyHighUvHint(hourly)
  const showFrost = shouldShowHourlyFrostHint(hourly)

  return (
    <ApolloCard
      cardId='hourly-weather-forecast'
      title={labels.title}
      icon={WeatherCardIcon}
      height={6}
      headingInfo={
        showPrecip || showHot || showWind || showHighUv || showFrost ? (
          <CardHeadingHints>
            {PRECIP_HINT_TYPES.map(precipType =>
              shouldShowHourlyPrecipHint(hourly, precipType) ? (
                <CardHintIcon
                  key={precipType}
                  Icon={precipTypeIcon(precipType)}
                  variant={precipHintVariant(precipType)}
                  title={labels[hourlyPrecipTitleKey[precipType]]}
                  description={formatHintLine(
                    hintExplanations[hourlyPrecipHintKey[precipType]].line1,
                    maxHourlyPrecipPercentForType(hourly, precipType),
                    0,
                  )}
                />
              ) : null,
            )}
            {showHot ? (
              <CardHintIcon
                Icon={ThermometerSunIcon}
                variant='warning'
                title={weatherLabels.hotOutdoor}
                description={formatHintLine(hintExplanations.hourlyHotOutdoor.line1, maxHourlyTemp(hourly), 0)}
              />
            ) : null}
            {showWind ? (
              <CardHintIcon
                Icon={WindIcon}
                variant='info'
                title={weatherLabels.strongWind}
                description={formatHintLine(hintExplanations.hourlyStrongWind.line1, maxHourlyWindSpeed(hourly), 0)}
              />
            ) : null}
            {showHighUv ? (
              <CardHintIcon
                Icon={UVIcon}
                variant='warning'
                title={weatherLabels.highUv}
                description={formatHintLine(hintExplanations.hourlyHighUv.line1, maxHourlyUv(hourly), 1)}
              />
            ) : null}
            {showFrost ? (
              <CardHintIcon
                Icon={CoolingIcon}
                variant='info'
                title={weatherLabels.frost}
                description={formatHintLine(hintExplanations.hourlyFrost.line1, minHourlyTemp(hourly), 0)}
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

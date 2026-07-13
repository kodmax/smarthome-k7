import { Box } from '@mui/material'
import { type FC } from 'react'
import { RainIcon, ThermometerSunIcon, WeatherIcon as WeatherCardIcon, WindIcon } from '@repo/assets'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { useFeed } from '@repo/feed-client'
import { HourWeatherForecast, WeatherFeed } from '@repo/types'
import { formatIsoWeekdayShort, useTranslations } from '@/i18n'
import { indicatorRed } from '../../components/colorForValueInRange'
import { shouldShowHourlyHotHint, shouldShowHourlyRainHint, shouldShowHourlyWindHint } from '../hourlyWeatherHints'
import { ForecastRow, ScrollArea } from './styled'
import { Hour } from './Hour'

const { icon, space } = designTokens

export const HourlyWeatherForecast: FC<Record<string, never>> = () => {
  const zoom = useZoom('hourly-weather-forecast')
  const forecast = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()
  const labels = t.dashboard.hourlyWeatherForecast
  const weatherLabels = t.dashboard.weather

  const showRain = shouldShowHourlyRainHint(forecast?.hourly)
  const showHot = shouldShowHourlyHotHint(forecast?.hourly)
  const showWind = shouldShowHourlyWindHint(forecast?.hourly)

  return (
    <ApolloCard
      cardId='hourly-weather-forecast'
      title={labels.title}
      icon={WeatherCardIcon}
      height={6}
      headingInfo={
        showRain || showHot || showWind ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: space[1] }}>
            {showRain ? (
              <RainIcon
                size={icon.sizeSm}
                strokeWidth={icon.strokeWidth}
                color='var(--mui-palette-info-main)'
                glow='default'
                aria-label={labels.rainChance}
              />
            ) : null}
            {showHot ? (
              <ThermometerSunIcon
                size={icon.sizeSm}
                strokeWidth={icon.strokeWidth}
                color={indicatorRed}
                glow='default'
                aria-label={weatherLabels.hotOutdoor}
              />
            ) : null}
            {showWind ? (
              <WindIcon
                size={icon.sizeSm}
                strokeWidth={icon.strokeWidth}
                color='var(--mui-palette-info-main)'
                glow='default'
                aria-label={weatherLabels.strongWind}
              />
            ) : null}
          </Box>
        ) : undefined
      }
    >
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

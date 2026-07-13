import { Box, TableBody } from '@mui/material'
import { type FC } from 'react'
import { ThermometerSunIcon, WeatherIcon as WeatherCardIcon, WindIcon } from '@repo/assets'
import { ApolloDataTable, HoursBars, Reading, TablePlaceholder } from '@/card-components'
import { beaufortLevelLabel, beaufortScaleFromMetersPerSecond } from './beaufort'
import { optimalHumidityRange } from './optimalHumidityRange'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { ArrowUp } from 'lucide-react'
import { getPosition, getMoonPosition } from 'suncalc'
import { useFeed } from '@repo/feed-client'
import { WeatherFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { sunTimes } from './sunTimes'
import { shouldShowHotOutdoorHint, shouldShowStrongWindHint } from './weatherHints'
import { indicatorRed } from '../components/colorForValueInRange'

const { icon, space } = designTokens

export const Weather: FC<Record<string, never>> = () => {
  const zoom = useZoom('current-weather')
  const feed = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()
  const labels = t.dashboard.weather

  if (feed === undefined) {
    return (
      <ApolloCard cardId='current-weather' title={labels.title} icon={WeatherCardIcon}>
        <TablePlaceholder rows={4} graph={true} value={true} />
      </ApolloCard>
    )
  }
  const moonAlt = (getMoonPosition(new Date(), 52.2287755, 20.9756375).altitude / Math.PI) * 180
  const sunAlt = (getPosition(new Date(), 52.2287755, 20.9756375).altitude / Math.PI) * 180
  const bs = beaufortScaleFromMetersPerSecond(feed.instant.wind.speed)
  const hum = feed.instant.humidity
  const sun = sunTimes(feed)

  const windMaxSpeed = feed.instant.wind.maxSpeed
  const windSpeed = feed.instant.wind.speed

  const showStrongWind = shouldShowStrongWindHint(feed.instant.wind.speed)
  const showHotOutdoor = shouldShowHotOutdoorHint(feed.instant.temp)

  return (
    <ApolloCard
      cardId='current-weather'
      title={labels.title}
      icon={WeatherCardIcon}
      headingInfo={
        showStrongWind || showHotOutdoor ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: space[1] }}>
            {showStrongWind ? (
              <WindIcon
                size={icon.sizeSm}
                strokeWidth={icon.strokeWidth}
                color='var(--mui-palette-info-main)'
                glow='default'
                aria-label={labels.strongWind}
              />
            ) : null}
            {showHotOutdoor ? (
              <ThermometerSunIcon
                size={icon.sizeSm}
                strokeWidth={icon.strokeWidth}
                color={indicatorRed}
                glow='default'
                aria-label={labels.hotOutdoor}
              />
            ) : null}
          </Box>
        ) : undefined
      }
    >
      <ApolloDataTable>
        <TableBody>
          <Reading
            title={labels.temperature}
            graph={<HoursBars data={feed.outdoorTemp} highest={30} lowest={15} optimal={24} color />}
            displayValue={Number(feed.instant.temp).toFixed(0)}
            unit='°C'
            colorIndicatorRange={{ optimal: 21, highest: 30, lowest: 15 }}
            value={feed.instant.temp}
          />
          <Reading
            title={labels.uvIndex}
            displayValue={String(feed.instant.uv)}
            colorIndicatorRange={{ optimal: 4, highest: 8, lowest: 0 }}
            value={feed.instant.uv}
          />
          <Reading
            title={labels.humidity}
            displayValue={hum.toFixed(0)}
            unit='%'
            colorIndicatorRange={optimalHumidityRange}
            value={hum}
          />
          <Reading
            title={labels.windSpeed}
            graph={
              <span style={{ fontSize: '0.5em' }}>
                {zoom ? `${bs} - ${beaufortLevelLabel(bs, labels.beaufortScale)}` : `${bs} B`}
              </span>
            }
            extraInfo={
              zoom ? (
                <ArrowUp
                  size={designTokens.icon.sizeXs - 4}
                  strokeWidth={designTokens.icon.strokeWidth}
                  style={{
                    transform: `rotate(${feed.instant.wind.angle}deg)`,
                    marginRight: `${designTokens.space[1]}px`,
                    verticalAlign: 'middle',
                  }}
                />
              ) : undefined
            }
            displayValue={windSpeed.toFixed(0)}
            unit='m/s'
            colorIndicatorRange={{ lowest: 0, highest: 7, optimal: 1 }}
            value={bs}
          />
          {!zoom ? null : <Reading title={labels.windGusts} displayValue={windMaxSpeed.toFixed(0)} unit='m/s' />}
          {!zoom ? null : sun.timeOfDay === 'day' ? (
            <Reading
              title={labels.sunAltitude}
              displayValue={Number(sunAlt).toFixed(0)}
              unit='°'
              colorIndicatorRange={{ lowest: -6, optimal: 30, highest: 50 }}
              value={sunAlt}
            />
          ) : (
            <Reading title={labels.moonAltitude} displayValue={Number(moonAlt).toFixed(0)} unit='°' />
          )}
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}

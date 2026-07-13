import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { WeatherIcon as WeatherCardIcon } from '@repo/assets'
import { ApolloDataTable, HoursBars, Reading, TablePlaceholder } from '@/card-components'
import { beaufortLevelLabel, beaufortScale } from './beaufort'
import { optimalHumidityRange } from './optimalHumidityRange'
import { ApolloCard, useZoom } from '@repo/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { ArrowUp } from 'lucide-react'
import { getPosition, getMoonPosition } from 'suncalc'
import { useFeed } from '@repo/feed-client'
import { WeatherFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { sunTimes } from './sunTimes'
import { toMetersPerSecond } from './windSpeed'

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
  const bs = beaufortScale(feed.instant.wind.speed)
  const hum = feed.instant.humidity
  const sun = sunTimes(feed)

  const windMaxSpeed = toMetersPerSecond(feed.instant.wind.maxSpeed, feed.instant.wind.speedUnit)
  const windSpeed = toMetersPerSecond(feed.instant.wind.speed, feed.instant.wind.speedUnit)

  return (
    <ApolloCard cardId='current-weather' title={labels.title} icon={WeatherCardIcon}>
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
            displayValue={String(windSpeed)}
            unit='m/s'
            colorIndicatorRange={{ lowest: 0, highest: 7, optimal: 1 }}
            value={bs}
          />
          {!zoom ? null : <Reading title={labels.windGusts} displayValue={String(windMaxSpeed)} unit='m/s' />}
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

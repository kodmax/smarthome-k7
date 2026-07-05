import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { WeatherIcon as WeatherCardIcon } from '@repo/assets'
import { ApolloDataTable, HoursBars, Reading, TablePlaceholder } from '@/card-components'
import { beaufortLevelLabel, beaufortScale } from './beaufort'
import { optimalHumidityRange } from './optimalHumidityRange'
import { ApolloCard, ZoomContext } from '@/apollo-card'
import { designTokens } from '@repo/design-tokens'
import { ArrowUp } from 'lucide-react'
import { getPosition, getMoonPosition } from 'suncalc'
import { useFeed } from '@repo/feed-client'
import { WeatherFeed } from '@repo/types'
import { sunTimes } from './sunTimes'
import { toMetersPerSecond } from './windSpeed'

export const Weather: FC<Record<string, never>> = () => {
  const feed = useFeed<WeatherFeed>('weather')

  if (feed === undefined) {
    return (
      <ApolloCard cardId='current-weather' title='Pogoda' icon={WeatherCardIcon}>
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
    <ApolloCard cardId='current-weather' title='Pogoda' icon={WeatherCardIcon}>
      <ZoomContext.Consumer>
        {zoom => (
          <ApolloDataTable>
            <TableBody>
              <Reading
                title='Temperatura'
                graph={<HoursBars data={feed.outdoorTemp} highest={30} lowest={15} optimal={24} color />}
                displayValue={Number(feed.instant.temp).toFixed(0)}
                unit='°C'
                colorIndicatorRange={{ optimal: 21, highest: 30, lowest: 15 }}
                value={feed.instant.temp}
              />
              <Reading
                title='Indeks UV'
                displayValue={String(feed.instant.uv)}
                colorIndicatorRange={{ optimal: 4, highest: 8, lowest: 0 }}
                value={feed.instant.uv}
              />
              <Reading
                title='Wilgotność'
                displayValue={hum.toFixed(0)}
                unit='%'
                colorIndicatorRange={optimalHumidityRange}
                value={hum}
              />
              <Reading
                title='Predkość wiatru'
                graph={
                  <span style={{ fontSize: '0.5em' }}>
                    {zoom.active ? `${bs} - ${beaufortLevelLabel(bs)}` : `${bs} B`}
                  </span>
                }
                extraInfo={
                  zoom.active ? (
                    <ArrowUp
                      size={designTokens.icon.sizeXs - 4}
                      strokeWidth={designTokens.icon.strokeWidth}
                      style={{
                        transform: `rotate(${feed.instant.wind.angle}deg)`,
                        marginRight: '0.25em',
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
              {!zoom.active ? null : <Reading title='Porywy wiatru' displayValue={String(windMaxSpeed)} unit='m/s' />}
              {!zoom.active ? null : sun.timeOfDay === 'day' ? (
                <Reading
                  title='Wysokość słońca'
                  displayValue={Number(sunAlt).toFixed(0)}
                  unit='°'
                  colorIndicatorRange={{ lowest: -6, optimal: 30, highest: 50 }}
                  value={sunAlt}
                />
              ) : (
                <Reading title='Wysokość księżyca' displayValue={Number(moonAlt).toFixed(0)} unit='°' />
              )}
            </TableBody>
          </ApolloDataTable>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}

import { type FC } from 'react'
import zoomBanner from './card-banners/weather-zoom.jpg'
import banner from './card-banners/weather.jpg'
import { ColorIndicator } from '../components/ColorIndication'
import { beaufortLevelLabel, beaufortScale, optimalHumidityRange } from '../../lib'
import ApolloCard, { ZoomContext } from '../../apollo-card/ApolloCard'
import TablePlaceholder from '../components/TablePlaceholder'
import { HoursBars } from '../components/HoursBars'
import NorthIcon from '@mui/icons-material/North'
import { getPosition, getMoonPosition } from 'suncalc'
import { useFeed } from '@repo/feed-client'
import { WeatherFeed } from '@repo/types'
import { sunTimes } from './sunTimes'

export const Weather: FC<Record<string, never>> = () => {
  const feed = useFeed<WeatherFeed>('weather')

  if (feed === undefined) {
    return (
      <ApolloCard cardId='current-weather' banner={banner}>
        <TablePlaceholder rows={4} graph={true} value={true} />
      </ApolloCard>
    )
  }
  const moonAlt = (getMoonPosition(new Date(), 52.2287755, 20.9756375).altitude / Math.PI) * 180
  const sunAlt = (getPosition(new Date(), 52.2287755, 20.9756375).altitude / Math.PI) * 180
  const bs = beaufortScale(feed.instant.wind.speed)
  const hum = feed.instant.humidity
  const sun = sunTimes(feed)

  const windMaxSpeed =
    feed.instant.wind.speedUnit === 'km/h' ? Math.round(feed.instant.wind.maxSpeed / 3.6) : feed.instant.wind.maxSpeed

  const windSpeed =
    feed.instant.wind.speedUnit === 'km/h' ? Math.round(feed.instant.wind.speed / 3.6) : feed.instant.wind.speed

  return (
    <ApolloCard cardId='current-weather' banner={banner} zoomBanner={zoomBanner}>
      <ZoomContext.Consumer>
        {zoom => (
          <table className='apollo-data-table'>
            <tbody>
              <tr>
                <td>Temperatura</td>
                <td>
                  <HoursBars data={feed.outdoorTemp} positiveMax={30} />
                </td>
                <td>
                  <ColorIndicator instant={feed.instant.temp} range={{ optimal: 21, highest: 30, lowest: 15 }} />
                  {Number(feed.instant.temp).toFixed(0)} °C
                </td>
              </tr>
              <tr>
                <td>Indeks UV</td>
                <td></td>
                <td>
                  <ColorIndicator instant={feed.instant.uv} range={{ optimal: 4, highest: 8, lowest: 0 }} />
                  {feed.instant.uv}
                </td>
              </tr>
              <tr>
                <td>Wilgotność</td>
                <td></td>
                <td>
                  <ColorIndicator instant={hum} range={optimalHumidityRange} />
                  {hum.toFixed(0)}%
                </td>
              </tr>
              <tr>
                <td>Predkość wiatru</td>
                <td style={{ fontSize: '0.5em' }}>{zoom.active ? `${bs} - ${beaufortLevelLabel(bs)}` : `${bs} B`}</td>
                <td>
                  {zoom.active ? (
                    <NorthIcon sx={{ transform: `rotate(${feed.instant.wind.angle}deg)`, marginRight: '0.25em' }} />
                  ) : null}
                  <ColorIndicator instant={bs} range={{ lowest: 0, highest: 7, optimal: 1 }} />
                  {windSpeed} m/s
                </td>
              </tr>
              {!zoom.active ? null : (
                <tr>
                  <td>Porywy wiatru</td>
                  <td></td>
                  <td>{windMaxSpeed} m/s</td>
                </tr>
              )}
              {!zoom.active ? null : (
                <tr>
                  <td>Wysokość {sun.timeOfDay === 'day' ? 'słońca' : 'księżyca'}</td>
                  <td></td>
                  {sun.timeOfDay === 'day' ? (
                    <td>
                      <ColorIndicator instant={sunAlt} range={{ lowest: -6, optimal: 30, highest: 50 }} />
                      {Number(sunAlt).toFixed(0)}°
                    </td>
                  ) : (
                    <td>{Number(moonAlt).toFixed(0)}°</td>
                  )}
                </tr>
              )}
            </tbody>
          </table>
        )}
      </ZoomContext.Consumer>
    </ApolloCard>
  )
}

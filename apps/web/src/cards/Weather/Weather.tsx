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
import { useUpdate } from '@repo/feed-client'
import { WeatherData } from '@repo/types'
import { sunTimes } from './sunTimes'

export const Weather: FC<Record<string, never>> = () => {
  const [weather, updatedAt] = useUpdate<WeatherData>('weather')

  if (weather) {
    const moonAlt = (getMoonPosition(new Date(), 52.2287755, 20.9756375).altitude / Math.PI) * 180
    const sunAlt = (getPosition(new Date(), 52.2287755, 20.9756375).altitude / Math.PI) * 180
    const bs = beaufortScale(weather.instant.wind.speed)
    const hum = weather.instant.humidity
    const sun = sunTimes(weather)

    return (
      <ApolloCard cardId='current-weather' banner={banner} zoomBanner={zoomBanner} updatedAt={updatedAt}>
        <ZoomContext.Consumer>
          {zoom => (
            <table className='apollo-data-table'>
              <tbody>
                <tr>
                  <td>Temperatura</td>
                  <td>
                    <HoursBars data={weather.outdoorTemp} positiveMax={30} />
                  </td>
                  <td>
                    <ColorIndicator instant={weather.instant.temp} range={{ optimal: 21, higest: 30, lowest: 15 }} />
                    {Number(weather.instant.temp).toFixed(0)} °C
                  </td>
                </tr>
                <tr>
                  <td>Predkość wiatru</td>
                  <td style={{ fontSize: '0.5em' }}>{zoom.active ? `${bs} - ${beaufortLevelLabel(bs)}` : `${bs} B`}</td>
                  <td>
                    {zoom.active ? (
                      <NorthIcon
                        sx={{ transform: `rotate(${weather.instant.wind.angle}deg)`, marginRight: '0.25em' }}
                      />
                    ) : null}
                    <ColorIndicator instant={bs} range={{ lowest: 0, higest: 7, optimal: 1 }} />
                    {weather.instant.wind.speed} km/h
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
                  <td>Jakość powietrza</td>
                  <td></td>
                  <td>
                    <ColorIndicator instant={weather.aq.aqi} range={{ optimal: 0, higest: 150 }} />
                    {weather.aq.aqi} AQI
                  </td>
                </tr>
                {!zoom.active || weather.instant.wind.speed === weather.instant.wind.maxSpeed ? null : (
                  <tr>
                    <td>Porywy wiatru</td>
                    <td></td>
                    <td>{weather.instant.wind.maxSpeed} km/h</td>
                  </tr>
                )}
                {!zoom.active ? null : (
                  <tr>
                    <td>Wysokość {sun.timeOfDay === 'day' ? 'słońca' : 'księżyca'}</td>
                    <td></td>
                    {sun.timeOfDay === 'day' ? (
                      <td>
                        <ColorIndicator instant={sunAlt} range={{ lowest: -6, optimal: 30, higest: 50 }} />
                        {Number(sunAlt).toFixed(0)}°
                      </td>
                    ) : (
                      <td>{Number(moonAlt).toFixed(0)}°</td>
                    )}
                  </tr>
                )}
                {!zoom.active ? null : (
                  <tr>
                    <td>Zachmurzenie</td>
                    <td></td>
                    <td>{weather.instant.clouds.coverage}</td>
                  </tr>
                )}
                {/* <Pressure /> */}
              </tbody>
            </table>
          )}
        </ZoomContext.Consumer>
      </ApolloCard>
    )
  } else {
    return (
      <ApolloCard cardId='current-weather' banner={banner}>
        <TablePlaceholder rows={4} graph={true} value={true} />
      </ApolloCard>
    )
  }
}

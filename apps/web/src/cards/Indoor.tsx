import { type FC, useCallback } from 'react'

import KnxReading from './components/KnxReading'
import zoomBanner from './card-banners/comfort-zoom.jpg'
import banner from './card-banners/comfort.jpg'
import Humidity from './components/Humidity'
import { ApolloCard } from '@/apollo-card'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import KnxStateIcon from './components/KnxStateIcon'
import { Warning } from '@mui/icons-material'
import { Co2Data, WeatherFeed } from '@repo/types'
import { sunTimes } from './Weather/sunTimes'
import TablePlaceholder from './components/TablePlaceholder'
import { ColorIndicator } from './components/ColorIndication'

export const Indoor: FC<Record<string, never>> = () => {
  const feed = useFeed<WeatherFeed>('weather')

  const onZoom = useCallback(() => {
    refreshFeeds(['weather', 'home.air-quality.co2', 'home.air-quality.humidity'])
  }, [])

  if (feed === undefined) {
    return (
      <ApolloCard cardId='air-quality' banner={banner}>
        <TablePlaceholder rows={4} graph={false} value={true} />
      </ApolloCard>
    )
  }

  const sun = sunTimes(feed)

  return (
    <ApolloCard cardId='air-quality' banner={banner} zoomBanner={zoomBanner} onZoom={onZoom}>
      <table className='apollo-data-table'>
        <tbody>
          <KnxReading
            id='home.air-quality.co2'
            label='Poziom CO₂'
            range={{ optimal: 400, highest: 1500 }}
            graph={{
              historyKey: 'today',
              scaleX: 1,
              scaleY: 1000,
            }}
            icon={
              <KnxStateIcon<Co2Data>
                icon={() => Warning}
                id='home.air-quality.co2'
                visible={payload => payload.alert.value === 1}
              />
            }
          />
          <Humidity label='Wilgotność' />
          <tr>
            <td>Jakość powietrza</td>
            <td></td>
            <td></td>
            <td>
              <ColorIndicator instant={feed.aq.aqi} range={{ optimal: 0, highest: 150 }} />
              {feed.aq.aqi} AQI
            </td>
          </tr>
          <tr>
            <td>{sun.timeOfDay === 'day' ? 'Zmierzch' : 'Świt'}</td>
            <td></td>
            <td></td>
            <td>{sun.time}</td>
          </tr>
        </tbody>
      </table>
    </ApolloCard>
  )
}

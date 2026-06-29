import { type FC, useCallback } from 'react'

import {
  ApolloDataTable,
  ColorIndicator,
  KnxReading,
  KnxStateIcon,
  TablePlaceholder,
} from '@/card-components'
import zoomBanner from './card-banners/comfort-zoom.jpg'
import banner from './card-banners/comfort.jpg'
import { ApolloCard } from '@/apollo-card'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { Warning } from '@mui/icons-material'
import { Co2Data, WeatherFeed } from '@repo/types'
import { optimalHumidityRange } from '../lib'
import { sunTimes } from './Weather/sunTimes'

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
      <ApolloDataTable>
        <tbody>
          <KnxReading
            id='home.air-quality.co2'
            label='Poziom CO₂'
            range={{ optimal: 400, highest: 1500 }}
            bars={{ historyKey: 'today', highest: 2000, lowest: 400, optimal: 600, color: true }}
            icon={
              <KnxStateIcon<Co2Data>
                icon={() => Warning}
                id='home.air-quality.co2'
                visible={payload => payload.alert.value === 1}
              />
            }
          />
          <KnxReading
            id='home.air-quality.humidity'
            label='Wilgotność'
            range={optimalHumidityRange}
            bars={{ historyKey: 'today', color: true, ...optimalHumidityRange }}
          />
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
      </ApolloDataTable>
    </ApolloCard>
  )
}

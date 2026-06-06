import { type FC, useCallback, useState } from 'react'

import KnxReading from './components/KnxReading'
import zoomBanner from './card-banners/comfort-zoom.jpg'
import banner from './card-banners/comfort.jpg'
import AQI from './components/AQI'
import Humidity from './components/Humidity'
import Pressure from './components/Pressure'
import ApolloCard from '../apollo-card/ApolloCard'
import { refreshFeeds } from '@repo/feed-client'
import KnxStateIcon from './components/KnxStateIcon'
import { Warning } from '@mui/icons-material'

export const AirQuality: FC<Record<string, never>> = () => {
  const [updatedAt, setUpdatedAt] = useState<number>()

  const onZoom = useCallback(() => {
    refreshFeeds(['weather', 'home.air-quality.co2', 'home.air-quality.humidity'])
  }, [])

  return (
    <ApolloCard cardId='air-quality' banner={banner} zoomBanner={zoomBanner} updatedAt={updatedAt} onZoom={onZoom}>
      <table className='apollo-data-table'>
        <tbody>
          <AQI onUpdate={setUpdatedAt} label='Air Polution' />
          <KnxReading
            onUpdate={setUpdatedAt}
            id='home.air-quality.co2'
            label='CO₂ Level'
            range={{ optimal: 400, higest: 1000 }}
            graph={{
              historyKey: 'today',
              scaleX: 1,
              scaleY: 1000,
            }}
            icon={
              <KnxStateIcon
                icon={() => Warning}
                onUpdate={setUpdatedAt}
                id='home.air-quality.co2'
                visible={payload => payload.alert.value}
              />
            }
          />
          <Humidity onUpdate={setUpdatedAt} label='Humidity' />
          <Pressure onUpdate={setUpdatedAt} />
        </tbody>
      </table>
    </ApolloCard>
  )
}

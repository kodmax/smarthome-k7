import { TableBody } from '@mui/material'
import { type FC, useCallback } from 'react'
import { AirQualityIcon, AlertIcon } from '@repo/assets'

import { ApolloDataTable, KnxReading, KnxStateIcon, Reading, TablePlaceholder } from '@/card-components'
import { ApolloCard } from '@repo/apollo-card'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { Co2Data, WeatherFeed } from '@repo/types'
import { optimalHumidityRange } from './Weather/optimalHumidityRange'
import { sunTimes } from './Weather/sunTimes'

export const Indoor: FC<Record<string, never>> = () => {
  const feed = useFeed<WeatherFeed>('weather')

  const onZoom = useCallback(() => {
    refreshFeeds(['weather', 'home.air-quality.co2', 'home.air-quality.humidity'])
  }, [])

  if (feed === undefined) {
    return (
      <ApolloCard cardId='air-quality' title='Jakość powietrza' icon={AirQualityIcon}>
        <TablePlaceholder rows={4} graph={false} value={true} />
      </ApolloCard>
    )
  }

  const sun = sunTimes(feed)

  return (
    <ApolloCard cardId='air-quality' title='Jakość powietrza' icon={AirQualityIcon} onZoom={onZoom}>
      <ApolloDataTable>
        <TableBody>
          <KnxReading
            feed='home.air-quality.co2'
            label='Poziom CO₂'
            range={{ optimal: 400, highest: 1500 }}
            bars={{ historyKey: 'today', highest: 2000, lowest: 400, optimal: 600, color: true }}
            icon={
              <KnxStateIcon<Co2Data>
                icon={() => AlertIcon}
                id='home.air-quality.co2'
                visible={payload => payload.alert.value === 1}
              />
            }
          />
          <KnxReading
            feed='home.air-quality.humidity'
            label='Wilgotność'
            range={optimalHumidityRange}
            bars={{ historyKey: 'today', color: true, ...optimalHumidityRange }}
          />
          <Reading
            title='Jakość powietrza'
            displayValue={String(feed.aq.aqi)}
            unit='AQI'
            colorIndicatorRange={{ optimal: 0, highest: 150 }}
            value={feed.aq.aqi}
          />
          <Reading title={sun.timeOfDay === 'day' ? 'Zmierzch' : 'Świt'} displayValue={sun.time} />
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}

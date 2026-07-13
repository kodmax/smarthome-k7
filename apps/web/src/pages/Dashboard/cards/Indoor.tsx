import { TableBody } from '@mui/material'
import { type FC, useCallback } from 'react'
import { AirQualityIcon, AlertIcon } from '@repo/assets'

import { ApolloDataTable, KnxReading, KnxStateIcon, Reading, TablePlaceholder } from '@/card-components'
import { ApolloCard } from '@repo/apollo-card'
import { refreshFeeds, useFeed } from '@repo/feed-client'
import { Co2Data, WeatherFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { optimalHumidityRange } from './Weather/optimalHumidityRange'
import { sunTimes } from './Weather/sunTimes'

export const Indoor: FC<Record<string, never>> = () => {
  const feed = useFeed<WeatherFeed>('weather')
  const { t } = useTranslations()
  const labels = t.dashboard.indoor

  const onZoom = useCallback(() => {
    refreshFeeds(['weather', 'home.air-quality.co2', 'home.air-quality.humidity'])
  }, [])

  if (feed === undefined) {
    return (
      <ApolloCard cardId='air-quality' title={labels.title} icon={AirQualityIcon}>
        <TablePlaceholder rows={4} graph={false} value={true} />
      </ApolloCard>
    )
  }

  const sun = sunTimes(feed)

  return (
    <ApolloCard cardId='air-quality' title={labels.title} icon={AirQualityIcon} onZoom={onZoom}>
      <ApolloDataTable>
        <TableBody>
          <KnxReading
            feed='home.air-quality.co2'
            label={labels.co2Level}
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
            label={labels.humidity}
            range={optimalHumidityRange}
            bars={{ historyKey: 'today', color: true, ...optimalHumidityRange }}
          />
          <Reading
            title={labels.airQuality}
            displayValue={String(feed.aq.aqi)}
            colorIndicatorRange={{ optimal: 0, highest: 150 }}
            value={feed.aq.aqi}
          />
          <Reading title={sun.timeOfDay === 'day' ? labels.dusk : labels.dawn} displayValue={sun.time} />
        </TableBody>
      </ApolloDataTable>
    </ApolloCard>
  )
}

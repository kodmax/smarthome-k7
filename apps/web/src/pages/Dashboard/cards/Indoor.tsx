import { TableBody } from '@mui/material'
import { type FC } from 'react'
import { AirQualityIcon, AlertIcon } from '@repo/assets'

import { ApolloDataTable, KnxReading, KnxStateIcon, Reading, TablePlaceholder } from '@/card-components'
import { BaseCard } from '@repo/apollo-card'
import { useFeed } from '@repo/feed-client'
import { Co2Data, WeatherFeed } from '@repo/types'
import { useTranslations } from '@/i18n'
import { CardHeadingHints, CardHintIcon } from '@/app/hints'
import { useIndoorAirHints } from './Indoor/useIndoorAirHints'
import { optimalHumidityRange } from './Weather/optimalHumidityRange'
import { sunTimes } from './Weather/sunTimes'

export const Indoor: FC<Record<string, never>> = () => {
  const feed = useFeed<WeatherFeed>('weather')
  const hints = useIndoorAirHints()
  const { t } = useTranslations()
  const labels = t.dashboard.indoor

  if (feed === undefined) {
    return (
      <BaseCard cardId='air-quality' title={labels.title} icon={AirQualityIcon}>
        <TablePlaceholder rows={4} graph={false} value={true} />
      </BaseCard>
    )
  }

  const sun = sunTimes(feed)

  return (
    <BaseCard
      cardId='air-quality'
      title={labels.title}
      icon={AirQualityIcon}
      headingInfo={
        hints.length > 0 ? (
          <CardHeadingHints>
            {hints.map(hint => (
              <CardHintIcon
                key={hint.key}
                Icon={hint.Icon}
                variant={hint.variant}
                title={hint.title}
                description={hint.description}
              />
            ))}
          </CardHeadingHints>
        ) : undefined
      }
    >
      <ApolloDataTable>
        <TableBody>
          <KnxReading
            feed='home.air-quality.co2'
            label={labels.co2Reading}
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
            label={labels.humidityReading}
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
    </BaseCard>
  )
}

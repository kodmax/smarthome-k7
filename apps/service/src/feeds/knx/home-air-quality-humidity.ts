import { FeedManager } from '@repo/feeds'
import { knxSchema } from '@repo/knx-schema'
import { HumidityHourlySource } from '@/data-sources'
import knxHumidity from '@/data-sources/knx/humidity'
import type { KnxLink } from 'js-knx'

export const addHomeAirQualityHumidityFeed = (feeds: FeedManager, knx: KnxLink): void => {
  const schema = knxSchema.home.airQuality.humidity

  feeds.addFeed(
    'home.air-quality.humidity',
    {
      humidityHourly: HumidityHourlySource,
      humidityReading: knxHumidity('home.air-quality.humidity', knx.group(schema.reading)),
    },
    ({ humidityReading, humidityHourly }) => ({
      reading: humidityReading,
      history: humidityHourly,
    }),
  )
}

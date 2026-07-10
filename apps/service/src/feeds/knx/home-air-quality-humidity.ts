import { Feeds } from '@repo/apollo-ws'
import { knxSchema } from '@repo/knx-schema'
import { HumidityHourlySource } from '@/data-sources'
import knxHumidity from '@/data-sources/knx/humidity'
import type { KnxLink } from 'js-knx'

export const addHomeAirQualityHumidityFeed = (feeds: Feeds, knx: KnxLink): void => {
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

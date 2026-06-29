import { Feeds } from '@repo/apollo-ws'
import { knxSchema } from '@repo/knx-schema'
import { humidityHourly } from '@/data-sources'
import knxHumidity from '@/data-sources/knx/humidity'
import type { KnxLink } from 'js-knx'

export const addHomeAirQualityHumidityFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.airQuality.humidity

  feeds.addFeed(
    'home.air-quality.humidity',
    {
      humidityHourly,
      humidityReading: knxHumidity('home.air-quality.humidity', knx.getDatapoint(schema.reading)),
    },
    ({ humidityReading, humidityHourly }) => ({
      ...humidityReading,
      ...humidityHourly,
    }),
  )
}

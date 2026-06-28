import { Feeds } from '@repo/apollo-ws'
import knxHumidity from '@/data-sources/knx/humidity'
import { knxSchema } from '../../home.knx-schema'
import type { KnxLink } from 'js-knx'

export const addHomeAirQualityHumidityFeed = (feeds: Feeds, knx: KnxLink): void => {
  const schema = knxSchema.home.airQuality.humidity

  feeds.addFeed('home.air-quality.humidity', {
    humidityReading: knxHumidity('home.air-quality.humidity', knx.getDatapoint(schema.reading)),
  })
}

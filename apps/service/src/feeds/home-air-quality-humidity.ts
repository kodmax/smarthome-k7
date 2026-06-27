import { Feeds } from '@repo/apollo-ws'
import knxHumidity from '../data-sources/knx/humidity'
import { airQuality } from '../home.knx-schema'
import type { KnxLink } from 'js-knx'

export const addHomeAirQualityHumidityFeed = (feeds: Feeds, knx: KnxLink): void => {
  feeds.addFeed('home.air-quality.humidity', {
    humidityReading: knxHumidity('home.air-quality.humidity', knx.getDatapoint(airQuality.Wilgotność.reading)),
  })
}

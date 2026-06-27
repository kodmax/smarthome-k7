import { Feeds } from '@repo/apollo-ws'
import knxHumidity from '../data-sources/knx/humidity'
import { airQuality } from '../home.knx-schema'
import { KnxConnection } from './knx-connection'

export const addHomeAirQualityHumidityFeed = (feeds: Feeds, knx: KnxConnection): void => {
  feeds.addFeed('home.air-quality.humidity', {
    humidityReading: knxHumidity('home.air-quality.humidity', knx.getDatapoint(airQuality.Wilgotność.reading)),
  })
}

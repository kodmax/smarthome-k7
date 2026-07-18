import { Feeds } from '@repo/apollo-ws'
import { knxSchema } from '@repo/knx-schema'
import { KnxLink } from 'js-knx'
import { addEnergyFeed } from './energy'
import { addHeatingFeed } from './heating'
import { addHomeAirQualityCo2Feed } from './home-air-quality-co2'
import { addHomeAirQualityHumidityFeed } from './home-air-quality-humidity'
import { addHomeTempFeed } from './home-temp'
import { addLightsFeed } from './lights'

export const initKnxFeeds = async (feeds: Feeds, knx: KnxLink): Promise<void> => {
  addHeatingFeed(feeds, knx)
  addEnergyFeed(feeds, knx)
  addLightsFeed(feeds, knx)
  addHomeAirQualityCo2Feed(feeds, knx)
  addHomeAirQualityHumidityFeed(feeds, knx)
  addHomeTempFeed(feeds, knx, 'bathroom-floor', knxSchema.home.temp.bathroomFloor)
  addHomeTempFeed(feeds, knx, 'bedroom', knxSchema.home.temp.bedroom)
  addHomeTempFeed(feeds, knx, 'livingroom', knxSchema.home.temp.livingRoom)
  addHomeTempFeed(feeds, knx, 'bathroom', knxSchema.home.temp.bathroom)
}

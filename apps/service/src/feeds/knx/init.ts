import { Feeds } from '@repo/apollo-ws'
import { knxSchema } from '@repo/knx-schema'
import { knxInit } from '../../knx-init'
import { addEnergyFeed } from './energy'
import { addHeatingFeed } from './heating'
import { addHomeAirQualityCo2Feed } from './home-air-quality-co2'
import { addHomeAirQualityHumidityFeed } from './home-air-quality-humidity'
import { addHomeTempFeed } from './home-temp'

export const initKnxFeeds = async (feeds: Feeds): Promise<void> => {
  const knx = await knxInit()

  addHeatingFeed(feeds, knx)
  addEnergyFeed(feeds, knx)
  addHomeAirQualityCo2Feed(feeds, knx)
  addHomeAirQualityHumidityFeed(feeds, knx)
  addHomeTempFeed(feeds, knx, 'bathroom-floor', knxSchema.home.temp.bathroomFloor)
  addHomeTempFeed(feeds, knx, 'bedroom', knxSchema.home.temp.bedroom)
  addHomeTempFeed(feeds, knx, 'livingroom', knxSchema.home.temp.livingRoom)
  addHomeTempFeed(feeds, knx, 'bathroom', knxSchema.home.temp.bathroom)
}

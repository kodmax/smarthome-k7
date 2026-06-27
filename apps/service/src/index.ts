#!/usr/bin/ts-node
process.setMaxListeners(100)

import { Server, Cache, sysLog, Feeds } from '@repo/apollo-ws'
import { config } from './config'
import path from 'node:path'
import { knxInit } from './knx-init'
import {
  addEnergyFeed,
  addHeatingFeed,
  addHomeAirQualityCo2Feed,
  addHomeAirQualityHumidityFeed,
  addHomeTempBathroomFeed,
  addHomeTempBathroomFloorFeed,
  addHomeTempBedroomFeed,
  addHomeTempLivingroomFeed,
  addJobsFeed,
  addNewsFeed,
  addStockMarketFeed,
  addTopTorrentsFeed,
  addWeatherFeed,
} from './feeds'

Server.listen({}, async apollo => {
  console.log('Feed cache directory:', path.resolve(config.cache.dir))
  const feeds = new Feeds(new Cache(config.cache.dir), apollo.vent)

  sysLog(apollo.vent, 6)

  addWeatherFeed(feeds)
  addStockMarketFeed(feeds)
  addNewsFeed(feeds)
  addJobsFeed(feeds)
  addTopTorrentsFeed(feeds)

  if (process.env.NO_KNX === '1') {
    return
  }

  const knx = await knxInit()

  addHeatingFeed(feeds, knx)
  addEnergyFeed(feeds, knx)
  addHomeAirQualityCo2Feed(feeds, knx)
  addHomeAirQualityHumidityFeed(feeds, knx)
  addHomeTempBathroomFloorFeed(feeds, knx)
  addHomeTempBedroomFeed(feeds, knx)
  addHomeTempLivingroomFeed(feeds, knx)
  addHomeTempBathroomFeed(feeds, knx)
})

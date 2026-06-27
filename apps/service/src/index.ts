#!/usr/bin/ts-node
process.setMaxListeners(100)

import { Server, Cache, sysLog, Feeds } from '@repo/apollo-ws'
import { KnxLink } from 'js-knx'
import { EventEmitter } from 'node:events'
import { KnxEventEmitter } from 'js-knx/dist/connection/link/LinkOptions'
import { config } from './config'
import path from 'node:path'
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
  const knxEvents: KnxEventEmitter = new EventEmitter()
  knxEvents.setMaxListeners(100)

  knxEvents.on('error', e => {
    console.error(e)
  })
  sysLog(apollo.vent, 6)

  addWeatherFeed(feeds)
  addStockMarketFeed(feeds)
  addNewsFeed(feeds)
  addJobsFeed(feeds)
  addTopTorrentsFeed(feeds)

  if (process.env.NO_KNX !== '1') {
    console.log('Establishing KNX connection ...')
    await KnxLink.connect('192.168.1.8', { events: knxEvents }).then(async knx => {
      console.log('KNX connection established.')
      process.on('SIGTERM', () => {
        knx.disconnect().then(() => process.exit(0))
        console.log('SIGTERM. Exiting.')
      })

      addHeatingFeed(feeds, knx)
      addEnergyFeed(feeds, knx)
      addHomeAirQualityCo2Feed(feeds, knx)
      addHomeAirQualityHumidityFeed(feeds, knx)
      addHomeTempBathroomFloorFeed(feeds, knx)
      addHomeTempBedroomFeed(feeds, knx)
      addHomeTempLivingroomFeed(feeds, knx)
      addHomeTempBathroomFeed(feeds, knx)
    })
  }
})

#!/usr/bin/ts-node
process.setMaxListeners(11)
import { Server, Cache, sysLog, Feeds } from '@repo/apollo-ws'
import { config } from './config'
import path from 'node:path'
import { initKnxFeeds, initWebFeeds } from './feeds'
import { setupGracefulShutdown } from './graceful-shutdown'

setupGracefulShutdown()

Server.listen({}, async apollo => {
  console.log('Feed cache directory:', path.resolve(config.cache.dir))
  const feeds = new Feeds(new Cache(config.cache.dir), apollo.vent)

  sysLog(apollo.vent, 6)

  await initWebFeeds(feeds)
  console.log('Web feeds initialized!')

  if (!config.knx.disabled) {
    await initKnxFeeds(feeds)
    console.log('KNX feeds initialized!')
  }
})

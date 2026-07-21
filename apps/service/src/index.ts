#!/usr/bin/ts-node
process.setMaxListeners(11)
import { Server, FSCache, RedisCache, sysLog, Feeds } from '@repo/apollo-ws'
import { initKnxCronJobs } from '@repo/cron-scripts'
import { getDbPool } from '@repo/db'
import { config } from './config'
import path from 'node:path'
import { getDependency, registerDependency } from './di'
import { initKnxFeeds, initWebFeeds } from './feeds'
import { knxInit } from './knx-init'
import { registerApollo, registerKnxCron, setupGracefulShutdown } from './graceful-shutdown'
import { initRedisClient } from './redis'

registerDependency('config', config)
registerDependency('db', getDbPool())

setupGracefulShutdown()

Server.listen({}, async apollo => {
  if (!config.redis.disabled) {
    registerDependency('redis', await initRedisClient())
    console.log('Redis connected')
  }

  console.log('Feed cache directory:', path.resolve(config.cache.dir))
  const cache = config.redis.disabled ? new FSCache(config.cache.dir) : new RedisCache(getDependency('redis'))
  const feeds = new Feeds(cache, apollo.vent)

  registerApollo(apollo, feeds)
  sysLog(apollo.vent, 6)

  await initWebFeeds(feeds)
  console.log('Web feeds initialized!')

  if (!config.knx.disabled) {
    const knx = await knxInit()
    registerDependency('knx', knx)
    await initKnxFeeds(feeds, knx)
    console.log('KNX feeds initialized!')

    if (!config.cron.disabled) {
      registerKnxCron(
        initKnxCronJobs(knx, (priority: number, msg: string) => {
          apollo.vent.emit('sys-log', priority, msg)
        }),
      )
      console.log('KNX cron jobs initialized!')
    }
  }
})

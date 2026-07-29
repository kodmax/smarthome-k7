#!/usr/bin/ts-node
process.setMaxListeners(11)
import { Server, FSCache, RedisCache, Feeds } from '@repo/apollo-ws'
import { initKnxCronJobs } from '@repo/cron-scripts'
import { getDbPool } from '@repo/db'
import { createLogger, readScopedLogLevel, redactUrl } from '@repo/logger'
import { config } from './config'
import path from 'node:path'
import { appMode, isDevelopment } from '@repo/env'
import { getDependency, registerDependency } from './di'
import { initKnxFeeds, initWebFeeds } from './feeds'
import { knxInit } from './knx-init'
import { registerApollo, registerKnxCron, setupGracefulShutdown } from './graceful-shutdown'
import { initOpenAIClient } from './openai'
import { initRedisClient } from './redis'
import { initPrometheus, registerWsMetrics } from './prometheus'
import { initSentry, captureProductionError } from './sentry'

const logger = createLogger({ name: 'service' })

if (isDevelopment) {
  logger.info({ appMode }, 'app mode')
}

initSentry(logger.child({ component: 'sentry' }, { level: readScopedLogLevel('sentry') }))
initPrometheus(logger.child({ component: 'metrics' }, { level: readScopedLogLevel('metrics') }))

const reportProductionError = (error: unknown, context: string) => {
  captureProductionError(error instanceof Error ? error : new Error(context, { cause: error }))
}

registerDependency('config', config)
registerDependency('db', getDbPool())
registerDependency('openai', initOpenAIClient())

setupGracefulShutdown(logger)

Server.listen(
  { logger: logger.child({ component: 'ws' }, { level: readScopedLogLevel('ws') }), onError: reportProductionError },
  async apollo => {
    const cacheBackend = config.redis.disabled ? 'fs' : 'redis'

    if (cacheBackend === 'redis') {
      registerDependency('redis', await initRedisClient(logger))
    }

    const cache = cacheBackend === 'fs' ? new FSCache(config.cache.dir) : new RedisCache(getDependency('redis'))
    const feeds = new Feeds(cache, apollo.vent, {
      logger: logger.child({ component: 'feeds' }, { level: readScopedLogLevel('feeds') }),
      onError: reportProductionError,
    })

    registerApollo(apollo, feeds)
    registerWsMetrics(apollo.vent)

    await initWebFeeds(feeds)
    logger.info({ feedCount: feeds.getFeedCount() }, 'Web feeds initialized')

    if (!config.knx.disabled) {
      const knx = await knxInit(logger.child({ component: 'knx' }, { level: readScopedLogLevel('knx') }))
      registerDependency('knx', knx)
      await initKnxFeeds(feeds, knx)
      logger.info({ feedCount: feeds.getFeedCount() }, 'KNX feeds initialized')

      if (!config.cron.disabled) {
        registerKnxCron(
          initKnxCronJobs(knx, logger.child({ component: 'knx-cron' }, { level: readScopedLogLevel('knx-cron') })),
        )
        logger.info('KNX cron jobs initialized')
      }
    }

    logger.info(
      {
        appMode,
        cacheBackend,
        ...(cacheBackend === 'fs' ? { cacheDir: path.resolve(config.cache.dir) } : {}),
        knx: !config.knx.disabled,
        cron: !config.cron.disabled,
        redis: cacheBackend === 'redis',
        ...(cacheBackend === 'redis' ? { redisHost: redactUrl(config.redis.url) } : {}),
        feedCount: feeds.getFeedCount(),
      },
      'Service initialized',
    )
  },
)

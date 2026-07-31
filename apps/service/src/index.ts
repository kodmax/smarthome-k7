#!/usr/bin/ts-node
process.setMaxListeners(11)
import { Server, FSCache, RedisCache, Feeds } from '@repo/apollo-ws'
import { initKnxCronJobs } from '@repo/cron-scripts'
import { getDbPool } from '@repo/db'
import { createLogger, readScopedLogLevel } from '@repo/logger'
import { config } from './config'
import path from 'node:path'
import { appMode, isDevelopment } from '@repo/env'
import { getDependency, registerDependency } from './di'
import { initKnxFeeds, initWebFeeds } from './feeds'
import { knxInit } from './knx-init'
import { registerApollo, registerKnxCron, setupGracefulShutdown } from './graceful-shutdown'
import { initOpenAIClient } from './openai'
import { initRedisClient } from './redis'
import { initPrometheus, registerWsMetrics, observeDataSourceRefresh } from './prometheus'
import { initSentry, captureProductionError } from './sentry'

const rootLogger = createLogger({ name: 'service' })

if (isDevelopment) {
  rootLogger.info({ appMode }, 'App mode')
}

initSentry(rootLogger)
initPrometheus(rootLogger)

const reportProductionError = (error: unknown, context: string) => {
  captureProductionError(error instanceof Error ? error : new Error(context, { cause: error }))
}

registerDependency('config', config)
registerDependency('db', getDbPool())
registerDependency('openai', initOpenAIClient())

setupGracefulShutdown(rootLogger)

Server.listen(
  {
    logger: rootLogger.child({ component: 'ws' }, { level: readScopedLogLevel('ws') }),
    onError: reportProductionError,
  },
  async (apollo, logger) => {
    const cacheBackend = config.redis.disabled ? 'fs' : 'redis'

    if (cacheBackend === 'redis') {
      registerDependency('redis', await initRedisClient(rootLogger))
    }

    const cache = cacheBackend === 'fs' ? new FSCache(config.cache.dir) : new RedisCache(getDependency('redis'))
    const feeds = new Feeds(cache, apollo.vent, {
      logger: rootLogger.child({ component: 'feeds' }, { level: readScopedLogLevel('feeds') }),
      onError: reportProductionError,
      observeDataSourceRefresh,
    })

    registerApollo(apollo, feeds)
    registerWsMetrics(apollo.vent)

    await initWebFeeds(feeds)

    if (!config.knx.disabled) {
      const knx = await knxInit(logger)
      registerDependency('knx', knx)
      await initKnxFeeds(feeds, knx)

      if (!config.cron.disabled) {
        registerKnxCron(
          initKnxCronJobs(knx, rootLogger.child({ component: 'knx-cron' }, { level: readScopedLogLevel('knx-cron') })),
        )
        rootLogger.info('KNX cron jobs initialized')
      }
    }

    logger.info({ feedCount: feeds.getFeedCount() }, 'Feeds initialized')

    rootLogger.info(
      {
        appMode,
        cacheBackend,
        ...(cacheBackend === 'fs' ? { cacheDir: path.resolve(config.cache.dir) } : {}),
        knx: !config.knx.disabled,
        cron: !config.cron.disabled,
        redis: cacheBackend === 'redis',
        feedCount: feeds.getFeedCount(),
      },
      'Service initialized',
    )
  },
)

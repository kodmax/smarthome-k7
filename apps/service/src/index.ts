#!/usr/bin/ts-node
process.setMaxListeners(11)
import { Server } from '@repo/apollo-ws'
import { FSCache, RedisCache, FeedComposer, FeedEvents, DataSourceRegistry } from '@repo/feeds'
import { Chronos } from '@repo/chronos'
import { getSql } from '@repo/db'
import { createLogger, readScopedLogLevel } from '@repo/logger'
import { config } from './config'
import path from 'node:path'
import { appMode, isDevelopment } from '@repo/env'
import { getDependency, registerDependency } from './di'
import { initKnxFeeds, initWebFeeds } from './feeds'
import { knxInit } from './knx-init'
import {
  registerApollo,
  registerDataSources,
  registerKnxCron,
  registerNestContext,
  setupGracefulShutdown,
} from './graceful-shutdown'
import { createNestContext } from './nest/nest-bootstrap'
import { initOpenAIClient } from './openai'
import { initRedisClient } from './redis'
import { initPrometheus, registerWsMetrics, observeDataSourceRefresh } from './prometheus'
import { initSentry, captureProductionError } from './sentry'
import { DataSourceRegistryType } from './data-sources'
import { PostgresCronJobLastSuccessStore } from './cron/postgresCronJobLastSuccessStore'
import { initKnxCronJobs } from '@repo/cron-scripts'

const main = async () => {
  const rootLogger = createLogger({ name: 'service' })

  if (isDevelopment) {
    rootLogger.info({ appMode }, 'App mode')
  }

  initSentry(rootLogger)
  initPrometheus(rootLogger)
  setupGracefulShutdown(rootLogger)

  registerNestContext(await createNestContext(rootLogger))

  const reportProductionError = (error: unknown, context: string) => {
    captureProductionError(error instanceof Error ? error : new Error(context, { cause: error }))
  }

  registerDependency('config', config)
  registerDependency('db', getSql())
  registerDependency('openai', initOpenAIClient())

  const cacheBackend = config.redis.disabled ? 'fs' : 'redis'

  if (cacheBackend === 'redis') {
    registerDependency('redis', await initRedisClient(rootLogger))
  }

  const feedEvents = new FeedEvents()

  feedEvents.on('error', (sourceId, error, context) => {
    rootLogger.child({ component: 'data-source' }).warn({ err: error, sourceId }, context)
    reportProductionError(error, context)
  })

  const cache = cacheBackend === 'fs' ? new FSCache(config.cache.dir) : new RedisCache(getDependency('redis'))

  const cronExecutionStore = new PostgresCronJobLastSuccessStore(getDependency('db'))

  const dataSourceChronos = new Chronos({
    logger: rootLogger.child({ component: 'data-source-cron' }, { level: readScopedLogLevel('data-source-cron') }),
    executionStore: cronExecutionStore,
  })

  const dataSources = new DataSourceRegistry<DataSourceRegistryType>({
    logger: rootLogger.child({ component: 'data-source' }),
    onError: reportProductionError,
    observeDataSourceRefresh,
    feedEvents,
    cache,
    chronos: dataSourceChronos,
  })

  const feeds = new FeedComposer(feedEvents, {
    logger: rootLogger.child({ component: 'feeds' }, { level: readScopedLogLevel('feeds') }),
    onError: reportProductionError,
  })

  const apollo = await Server.listen({
    logger: rootLogger.child({ component: 'ws' }, { level: readScopedLogLevel('ws') }),
    onError: reportProductionError,
    feedEvents,
  })
  registerApollo(apollo)
  registerDataSources(dataSources)

  registerWsMetrics(feedEvents)

  await initWebFeeds(feeds, dataSources)
  await dataSourceChronos.runMisfireRecovery()

  if (!config.knx.disabled) {
    const knx = await knxInit(rootLogger)
    registerDependency('knx', knx)
    await initKnxFeeds(feeds, dataSources)

    if (!config.cron.disabled) {
      registerKnxCron(
        initKnxCronJobs(knx, {
          logger: rootLogger.child({ component: 'knx-cron' }, { level: readScopedLogLevel('knx-cron') }),
          executionStore: cronExecutionStore,
        }),
      )
      rootLogger.info('KNX cron jobs initialized')
    }
  }

  rootLogger.info({ feedCount: feeds.getFeedCount() }, 'Feeds initialized')

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
}

void main()

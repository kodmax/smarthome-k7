#!/usr/bin/ts-node
import './load-env'
process.setMaxListeners(11)
import { FSCache, RedisCache, FeedComposer, FeedEvents, DataSourceRegistry } from '@repo/feeds'
import { Chronos } from '@repo/chronos'
import { getSql } from '@repo/db'
import { readScopedLogLevel, rootLogger } from '@repo/logger'
import { config } from './config'
import path from 'node:path'
import { appMode, isDevelopment } from '@repo/env'
import { getDependency, registerDependency } from './di'
import { initKnxFeeds, initWebFeeds } from './feeds'
import { knxInit } from './knx-init'
import { registerDataSources, registerKnxCron, registerNestApp, setupGracefulShutdown } from './graceful-shutdown'
import { createNestApp } from './nest/nest-bootstrap'
import { initOpenAIClient } from './openai'
import { initRedisClient } from './redis'
import { initPrometheus, registerWsMetrics, observeDataSourceRefresh } from './prometheus'
import { getOpenTelemetryServiceName, isOpenTelemetryStarted } from './otel-instrumentation'
import { captureProductionError, isSentryEnabled } from './sentry'
import { DataSourceRegistryType } from './data-sources'
import { PostgresCronJobLastSuccessStore } from './cron/postgresCronJobLastSuccessStore'
import { initKnxCronJobs } from '@repo/cron-scripts'

const main = async () => {
  const serviceLogger = rootLogger.child({ name: 'service' })

  if (isDevelopment) {
    serviceLogger.info({ appMode }, 'App mode')
  }

  initPrometheus(serviceLogger)

  if (isOpenTelemetryStarted()) {
    serviceLogger.info({ serviceName: getOpenTelemetryServiceName() }, 'OpenTelemetry enabled')
  }

  if (isSentryEnabled()) {
    serviceLogger.info({ environment: appMode, release: process.env.SENTRY_RELEASE }, 'Sentry enabled')
  }

  setupGracefulShutdown(serviceLogger)

  const reportProductionError = (error: unknown, context: string) => {
    captureProductionError(error instanceof Error ? error : new Error(context, { cause: error }))
  }

  registerDependency('config', config)
  registerDependency('db', getSql())
  registerDependency('openai', initOpenAIClient())

  const cacheBackend = config.redis.disabled ? 'fs' : 'redis'

  if (cacheBackend === 'redis') {
    registerDependency('redis', await initRedisClient(serviceLogger))
  }

  const feedEvents = new FeedEvents()

  feedEvents.on('error', (sourceId, error, context) => {
    serviceLogger.child({ component: 'data-source' }).warn({ err: error, sourceId }, context)
    reportProductionError(error, context)
  })

  const cache = cacheBackend === 'fs' ? new FSCache(config.cache.dir) : new RedisCache(getDependency('redis'))

  const cronExecutionStore = new PostgresCronJobLastSuccessStore(getDependency('db'))

  const dataSourceChronos = new Chronos({
    logger: serviceLogger.child({ component: 'data-source-cron' }, { level: readScopedLogLevel('data-source-cron') }),
    executionStore: cronExecutionStore,
  })

  const dataSources = new DataSourceRegistry<DataSourceRegistryType>({
    logger: serviceLogger.child({ component: 'data-source' }),
    onError: reportProductionError,
    observeDataSourceRefresh,
    feedEvents,
    cache,
    chronos: dataSourceChronos,
  })

  const feeds = new FeedComposer(feedEvents, {
    logger: serviceLogger.child({ component: 'feeds' }, { level: readScopedLogLevel('feeds') }),
    onError: reportProductionError,
  })

  registerDataSources(dataSources)

  registerWsMetrics(feedEvents)

  await initWebFeeds(feeds, dataSources)
  await dataSourceChronos.runMisfireRecovery()

  if (!config.knx.disabled) {
    const knx = await knxInit(serviceLogger)
    registerDependency('knx', knx)
    await initKnxFeeds(feeds, dataSources)

    if (!config.cron.disabled) {
      registerKnxCron(
        initKnxCronJobs(knx, {
          logger: serviceLogger.child({ component: 'knx-cron' }, { level: readScopedLogLevel('knx-cron') }),
          executionStore: cronExecutionStore,
        }),
      )
      serviceLogger.info('KNX cron jobs initialized')
    }
  }

  serviceLogger.info({ feedCount: feeds.getFeedCount() }, 'Feeds initialized')

  registerNestApp(
    await createNestApp({
      dataSources,
      feeds,
      feedEvents,
      onError: reportProductionError,
    }),
  )

  serviceLogger.info(
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

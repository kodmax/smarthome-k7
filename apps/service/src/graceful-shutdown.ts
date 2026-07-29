import type { Feeds, Server } from '@repo/apollo-ws'
import type { Logger } from '@repo/logger'
import { closeDbPool } from '@repo/db'
import { closePrometheus } from './prometheus'
import { captureProductionError, closeSentry } from './sentry'
import { closeRedisClient } from './redis'
import type { KnxLink } from 'js-knx'

let knxLink: KnxLink | undefined
let knxCron: { stop(): void } | undefined
let apolloFeeds: Feeds | undefined
let apolloServer: Server | undefined
let shuttingDown = false
let shutdownLogger: Logger | undefined

export const registerKnxLink = (link: KnxLink): void => {
  knxLink = link
}

export const registerKnxCron = (chronos: { stop(): void }): void => {
  knxCron = chronos
}

export const registerApollo = (server: Server, feeds: Feeds): void => {
  apolloServer = server
  apolloFeeds = feeds
}

const closeConnections = async (logger: Logger): Promise<void> => {
  if (knxCron !== undefined) {
    knxCron.stop()
    logger.info({ step: 'knx-cron' }, 'Shutdown step complete')
  }

  if (apolloFeeds !== undefined) {
    apolloFeeds.close()
    logger.info({ step: 'feeds' }, 'Shutdown step complete')
  }

  const knx = knxLink
  knxLink = undefined

  if (knx !== undefined) {
    try {
      await knx.disconnect()
      logger.info({ step: 'knx' }, 'Shutdown step complete')
    } catch (err) {
      shutdownLogger?.error({ err, step: 'knx' }, 'KNX disconnect failed')
      captureProductionError(err)
    }
  }

  if (apolloServer !== undefined) {
    await apolloServer.close()
    logger.info({ step: 'ws' }, 'Shutdown step complete')
  }

  if (await closeRedisClient()) {
    logger.info({ step: 'redis' }, 'Shutdown step complete')
  }

  await closeDbPool()
  logger.info({ step: 'db' }, 'Shutdown step complete')

  await closePrometheus()
  logger.info({ step: 'metrics' }, 'Shutdown step complete')

  await closeSentry()
  logger.info({ step: 'sentry' }, 'Shutdown step complete')
}

export const setupGracefulShutdown = (logger: Logger): void => {
  shutdownLogger = logger

  const shutdown = (signal: string): void => {
    if (shuttingDown) {
      logger.warn({ signal }, 'Shutdown already in progress')
      process.exit(1)
      return
    }
    shuttingDown = true

    const start = Date.now()
    logger.info({ signal }, 'Shutdown started')

    closeConnections(logger)
      .then(() => {
        logger.info({ signal, durationMs: Date.now() - start }, 'Shutdown complete')
        process.exit(0)
      })
      .catch(err => {
        logger.error({ err, signal, durationMs: Date.now() - start }, 'Failed during shutdown')
        captureProductionError(err)
        void closeSentry().finally(() => process.exit(1))
      })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

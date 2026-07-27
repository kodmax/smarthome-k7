import type { Feeds, Server } from '@repo/apollo-ws'
import type { Logger } from '@repo/logger'
import { closeDbPool } from '@repo/db'
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

const closeConnections = async (): Promise<void> => {
  if (knxCron !== undefined) {
    knxCron.stop()
  }

  if (apolloFeeds !== undefined) {
    apolloFeeds.close()
  }

  const knx = knxLink
  knxLink = undefined

  if (knx !== undefined) {
    try {
      await knx.disconnect()
    } catch (err) {
      shutdownLogger?.error({ err }, 'KNX disconnect failed')
      captureProductionError(err)
    }
  }

  if (apolloServer !== undefined) {
    await apolloServer.close()
  }

  await closeRedisClient()
  await closeDbPool()
  await closeSentry()
}

export const setupGracefulShutdown = (logger: Logger): void => {
  shutdownLogger = logger

  const shutdown = (signal: string): void => {
    if (shuttingDown) {
      process.exit(1)
      return
    }
    shuttingDown = true

    logger.info({ signal }, 'Exiting')

    closeConnections()
      .then(() => process.exit(0))
      .catch(err => {
        logger.error({ err }, 'Failed during shutdown')
        captureProductionError(err)
        void closeSentry().finally(() => process.exit(1))
      })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

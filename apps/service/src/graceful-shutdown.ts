import type { INestApplication } from '@nestjs/common'
import type { Logger } from '@repo/logger'
import { closeSql } from '@repo/db'
import { closeOpenTelemetry } from './otel-instrumentation'
import { closePrometheus } from './prometheus'
import { captureProductionError, closeSentry } from './sentry'
import { closeRedisClient } from './redis'
import type { KnxLink } from 'js-knx'

let knxLink: KnxLink | undefined
let knxConnectAttempt: KnxLink | undefined
let knxCron: { stop(): void } | undefined
let nestApp: INestApplication | undefined
let dataSourceRegistry: { close(): void } | undefined
let shuttingDown = false
let shutdownLogger: Logger | undefined

export class StartupAbortedError extends Error {
  constructor() {
    super('Startup aborted during shutdown')
    this.name = 'StartupAbortedError'
  }
}

export function isShuttingDown(): boolean {
  return shuttingDown
}

export const registerKnxLink = (link: KnxLink): void => {
  knxLink = link
}

export const registerKnxConnectAttempt = (link: KnxLink): void => {
  knxConnectAttempt = link
}

export const clearKnxConnectAttempt = (): void => {
  knxConnectAttempt = undefined
}

export const registerKnxCron = (chronos: { stop(): void }): void => {
  knxCron = chronos
}

export const registerDataSources = (registry: { close(): void }): void => {
  dataSourceRegistry = registry
}

export const registerNestApp = (ctx: INestApplication): void => {
  nestApp = ctx
}

const closeConnections = async (logger: Logger): Promise<void> => {
  const connectAttempt = knxConnectAttempt
  knxConnectAttempt = undefined

  if (connectAttempt !== undefined) {
    connectAttempt.abortConnect()
    logger.info({ step: 'knx-connect' }, 'KNX connect aborted')
  }

  if (nestApp !== undefined) {
    await nestApp.close()
    logger.info({ step: 'nest' }, 'Shutdown step complete')
  }

  if (knxCron !== undefined) {
    knxCron.stop()
    logger.info({ step: 'knx-cron' }, 'Shutdown step complete')
  }

  if (dataSourceRegistry !== undefined) {
    dataSourceRegistry.close()
    logger.info({ step: 'data-sources' }, 'Shutdown step complete')
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

  if (await closeRedisClient()) {
    logger.info({ step: 'redis' }, 'Shutdown step complete')
  }

  await closeSql()
  logger.info({ step: 'db' }, 'Shutdown step complete')

  await closePrometheus()
  logger.info({ step: 'metrics' }, 'Shutdown step complete')

  try {
    await closeOpenTelemetry()
    logger.info({ step: 'open-telemetry' }, 'Shutdown step complete')
  } catch (err) {
    logger.error({ err, step: 'open-telemetry' }, 'OpenTelemetry shutdown failed')
    captureProductionError(err)
  }

  try {
    await closeSentry()
    logger.info({ step: 'sentry' }, 'Shutdown step complete')
  } catch (err) {
    logger.error({ err, step: 'sentry' }, 'Sentry shutdown failed')
    captureProductionError(err)
  }
}

export const setupGracefulShutdown = (logger: Logger): void => {
  shutdownLogger = logger

  const exitProcess = (code: number): void => {
    logger.flush(() => {
      if (process.env.WATCH_PARENT_EXIT === '1' && process.ppid > 1) {
        try {
          process.kill(process.ppid, 'SIGTERM')
        } catch {
          // watch parent already exiting
        }
      }
      process.exit(code)
    })
  }

  const shutdown = (signal: string): void => {
    if (shuttingDown) {
      logger.warn(
        { signal },
        'Duplicate shutdown signal ignored (turbo/node --watch may deliver SIGINT twice per Ctrl+C)',
      )
      return
    }
    shuttingDown = true

    const start = Date.now()
    logger.info({ signal }, 'Shutdown started')

    closeConnections(logger)
      .then(() => {
        logger.info({ signal, durationMs: Date.now() - start }, 'Shutdown complete')
        exitProcess(0)
      })
      .catch(err => {
        logger.error({ err, signal, durationMs: Date.now() - start }, 'Failed during shutdown')
        captureProductionError(err)
        void closeSentry().finally(() => exitProcess(1))
      })
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))
}

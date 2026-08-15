import { KnxLink } from 'js-knx'
import type { Logger } from '@repo/logger'
import { config } from './config'
import {
  clearKnxConnectAttempt,
  isShuttingDown,
  registerKnxConnectAttempt,
  registerKnxLink,
  StartupAbortedError,
} from './graceful-shutdown'
import { captureProductionError } from './sentry'
import { isConnectionAborted, isKnxReadTimeout } from './sentry/knxError'

export const knxInit = async (logger: Logger): Promise<KnxLink> => {
  logger.info({ host: config.knx.host }, 'Establishing KNX connection')
  const start = Date.now()
  const link = new KnxLink(config.knx.host)
  link.on('error', e => {
    if (isKnxReadTimeout(e)) {
      logger.warn(
        {
          err: e,
          host: config.knx.host,
          groupAddress: e.details.address,
          consecutiveReadTimeouts: e.details.consecutiveReadTimeouts,
        },
        'KNX read timeout',
      )
    } else {
      logger.error({ err: e, host: config.knx.host }, 'KNX link error')
    }

    captureProductionError(e)
  })

  registerKnxConnectAttempt(link)

  try {
    await link.connect()
  } catch (error) {
    if (isConnectionAborted(error)) {
      throw new StartupAbortedError()
    }

    throw error
  } finally {
    clearKnxConnectAttempt()
  }

  if (isShuttingDown()) {
    await link.disconnect()
    throw new StartupAbortedError()
  }

  logger.info({ host: config.knx.host, durationMs: Date.now() - start }, 'KNX connection established')

  registerKnxLink(link)

  return link
}

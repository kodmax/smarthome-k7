import { KnxLink } from 'js-knx'
import type { Logger } from '@repo/logger'
import { config } from './config'
import { registerKnxLink } from './graceful-shutdown'
import { captureProductionError } from './sentry'

export const knxInit = async (logger: Logger): Promise<KnxLink> => {
  logger.info('Establishing KNX connection ...')
  const link = new KnxLink(config.knx.host)
  link.on('error', e => {
    logger.error({ err: e }, 'KNX link error')
    captureProductionError(e)
  })
  await link.connect()
  logger.info('KNX connection established')

  registerKnxLink(link)

  return link
}

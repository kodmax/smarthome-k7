import { KnxLink } from 'js-knx'
import { config } from './config'
import { registerKnxLink } from './graceful-shutdown'
import { captureProductionError } from './sentry'

export const knxInit = async (): Promise<KnxLink> => {
  console.log('Establishing KNX connection ...')
  const link = new KnxLink(config.knx.host)
  link.on('error', e => {
    console.error(e)
    captureProductionError(e)
  })
  await link.connect()
  console.log('KNX connection established.')

  registerKnxLink(link)

  return link
}

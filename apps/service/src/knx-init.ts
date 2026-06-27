import { KnxLink } from 'js-knx'
import { EventEmitter } from 'node:events'
import { KnxEventEmitter } from 'js-knx/dist/connection/link/LinkOptions'
import { config } from './config'

export const knxInit = async (): Promise<KnxLink> => {
  const knxEvents: KnxEventEmitter = new EventEmitter()
  knxEvents.setMaxListeners(100)

  knxEvents.on('error', e => {
    console.error(e)
  })

  console.log('Establishing KNX connection ...')
  const link = await KnxLink.connect(config.knx.host, { events: knxEvents })
  console.log('KNX connection established.')

  process.on('SIGTERM', () => {
    link.disconnect().then(() => process.exit(0))
    console.log('SIGTERM. Exiting.')
  })

  return link
}

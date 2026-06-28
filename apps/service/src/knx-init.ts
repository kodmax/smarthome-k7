import { KnxLink } from 'js-knx'
import { EventEmitter } from 'node:events'
import { KnxEventEmitter } from 'js-knx/dist/connection/link/LinkOptions'
import { config } from './config'
import { registerKnxLink } from './graceful-shutdown'

export const knxInit = async (): Promise<KnxLink> => {
  const knxEvents: KnxEventEmitter = new EventEmitter()
  knxEvents.setMaxListeners(100)

  knxEvents.on('error', e => {
    console.error(e)
  })

  console.log('Establishing KNX connection ...')
  const link = await KnxLink.connect(config.knx.host, { events: knxEvents })
  console.log('KNX connection established.')

  registerKnxLink(link)

  return link
}

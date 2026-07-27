import { createLogger } from '@repo/logger'
import { DPT_StartStop, KnxLink } from 'js-knx'
import { config } from '../src/config'

const logger = createLogger({ name: 'knx-go' })

const main = async () => {
  logger.info({ host: config.knx.host }, 'Establishing KNX connection')
  const start = Date.now()
  const knx = new KnxLink(config.knx.host)
  await knx.connect()
  logger.info({ host: config.knx.host, durationMs: Date.now() - start }, 'KNX connection established')

  const startGroup = knx.group({
    address: '5/2/1',
    DataType: DPT_StartStop,
  })

  await startGroup.write(1)
  await startGroup.write(1)

  await knx.disconnect()
  logger.info({ host: config.knx.host }, 'KNX disconnected')
}

main().catch(err => {
  logger.error({ err, host: config.knx.host }, 'KNX script failed')
  process.exitCode = 1
})

import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import pino from 'pino'
import { Transmission3, type TransmissionClientConfig } from '../src'
import { getTransmissionConfig } from '../src/config'

loadEnv({ path: path.resolve(__dirname, '../.env'), quiet: true })

const logger = pino({ name: 'transmission-test' })

const main = async (config: TransmissionClientConfig) => {
  const transmission = new Transmission3(config)
  logger.info(await transmission.getSessionStats())
}

main(getTransmissionConfig())

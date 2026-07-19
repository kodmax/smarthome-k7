import { config as loadEnv } from 'dotenv'
import path from 'node:path'
import { Transmission3, type TransmissionClientConfig } from '../src'
import { getTransmissionConfig } from '../src/config'

loadEnv({ path: path.resolve(__dirname, '../.env'), quiet: true })

const main = async (config: TransmissionClientConfig) => {
  const transmission = new Transmission3(config)
  console.log(await transmission.getSessionStats())
}

main(getTransmissionConfig())

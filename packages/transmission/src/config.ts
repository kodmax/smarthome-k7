import { type TransmissionClientConfig } from './Transmission/types'

const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (value === undefined || value === '') {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

/** Runtime client — TRANSMISSION_* from apps/service/.env. */
export const getTransmissionConfig = (): TransmissionClientConfig => ({
  url: requireEnv('TRANSMISSION_URL'),
  username: process.env.TRANSMISSION_USERNAME,
  password: process.env.TRANSMISSION_PASSWORD,
})

import { config as loadEnv } from 'dotenv'

if (process.env.NODE_ENV !== 'production') {
  loadEnv({ quiet: true })
}

export const requireEnv = (name: string): string => {
  const value = process.env[name]

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`)
  }

  return value
}

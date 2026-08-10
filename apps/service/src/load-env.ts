import path from 'node:path'
import { configDotenv } from 'dotenv'
import { isDevelopment } from '@repo/env'

if (process.env.VITEST !== 'true' && isDevelopment) {
  configDotenv({ path: path.resolve(__dirname, '../.env') })
}

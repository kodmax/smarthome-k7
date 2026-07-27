import { createClient, type RedisClientType } from 'redis'
import type { Logger } from '@repo/logger'
import { redactUrl } from '@repo/logger'
import { config } from '../config'
import { captureProductionError } from '../sentry'

let client: RedisClientType | undefined

export const initRedisClient = async (logger: Logger): Promise<RedisClientType> => {
  if (client !== undefined) {
    return client
  }

  const redisHost = redactUrl(config.redis.url)
  client = createClient({ url: config.redis.url })
  client.on('error', err => {
    logger.error({ err, redisHost }, 'Redis error')
    captureProductionError(err)
  })
  await client.connect()
  logger.info({ redisHost }, 'Redis connected')

  return client
}

export const getRedisClient = (): RedisClientType => {
  if (client === undefined) {
    throw new Error('Redis client is not initialized')
  }

  return client
}

export const closeRedisClient = async (): Promise<boolean> => {
  if (client === undefined) {
    return false
  }

  await client.quit()
  client = undefined
  return true
}

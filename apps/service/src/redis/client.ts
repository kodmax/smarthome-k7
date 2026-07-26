import { createClient, type RedisClientType } from 'redis'
import { config } from '../config'
import { captureProductionError } from '../sentry'

let client: RedisClientType | undefined

export const initRedisClient = async (): Promise<RedisClientType> => {
  if (client !== undefined) {
    return client
  }

  client = createClient({ url: config.redis.url })
  client.on('error', err => {
    console.error('Redis error:', err)
    captureProductionError(err)
  })
  await client.connect()

  return client
}

export const getRedisClient = (): RedisClientType => {
  if (client === undefined) {
    throw new Error('Redis client is not initialized')
  }

  return client
}

export const closeRedisClient = async (): Promise<void> => {
  if (client === undefined) {
    return
  }

  await client.quit()
  client = undefined
}

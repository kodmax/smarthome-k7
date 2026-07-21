import { CorruptCacheError } from '../Errors'
import { RedisCacheEntry } from './RedisCacheEntry'
import { isExpired } from './ttl'
import type { Cache, CacheEntry, CacheOptions } from './types'
import type { RedisClient } from './RedisClient'

type RedisCachePayload<T> = {
  timestamp: number
  content: T
}

class RedisCache implements Cache {
  public constructor(
    private readonly redis: RedisClient,
    private readonly keyPrefix = 'apollo-ws:cache:',
  ) {}

  public async getEntry<T>(id?: string, options?: CacheOptions): Promise<CacheEntry<T>> {
    const ttlMs = options?.ttlMs

    if (id === undefined) {
      return new RedisCacheEntry<T>(this.redis, undefined, { timestamp: new Date().getTime() }, ttlMs)
    }

    const key = this.key(id)

    try {
      const raw = await this.redis.get(key)
      if (raw === null) {
        return new RedisCacheEntry<T>(this.redis, key, { timestamp: new Date().getTime() }, ttlMs)
      }

      const payload = JSON.parse(raw) as RedisCachePayload<T>

      if (isExpired(payload.timestamp, ttlMs)) {
        await this.redis.del(key)

        return new RedisCacheEntry<T>(this.redis, key, { timestamp: new Date().getTime() }, ttlMs)
      }

      return new RedisCacheEntry<T>(
        this.redis,
        key,
        {
          timestamp: payload.timestamp,
          content: payload.content,
        },
        ttlMs,
      )
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new CorruptCacheError(id, e)
      }

      throw e
    }
  }

  private key(id: string): string {
    return `${this.keyPrefix}${id}`
  }
}

export { RedisCache }

import { CorruptCacheError } from '../Errors'
import { Snapshot } from './Snapshot'
import type { RedisClient } from './RedisClient'
import { isExpired } from './ttl'
import type { CacheEntry } from './types'

type RedisCachePayload<T> = {
  timestamp: number
  content: T
}

class RedisCacheEntry<T> implements CacheEntry<T> {
  public constructor(
    private readonly redis: RedisClient,
    private readonly key: string,
    private readonly sourceId: string,
    private readonly ttlMs?: number,
  ) {}

  public async write(data: T): Promise<T> {
    const timestamp = new Date().getTime()
    const payload = JSON.stringify({ timestamp, content: data })

    if (this.ttlMs !== undefined && this.ttlMs > 0) {
      await this.redis.set(this.key, payload, { EX: Math.ceil(this.ttlMs / 1000) })
    } else {
      await this.redis.set(this.key, payload)
    }

    return data
  }

  public async getSnapshot(): Promise<Snapshot<T> | null> {
    try {
      const raw = await this.redis.get(this.key)
      if (raw === null) {
        return null
      }

      const payload = JSON.parse(raw) as RedisCachePayload<T>

      if (isExpired(payload.timestamp, this.ttlMs)) {
        return this.expire()
      }

      return new Snapshot({
        timestamp: payload.timestamp,
        content: payload.content,
      })
    } catch (e) {
      if (e instanceof SyntaxError) {
        throw new CorruptCacheError(this.sourceId, e)
      }

      throw e
    }
  }

  private async expire(): Promise<null> {
    await this.redis.del(this.key)

    return null
  }
}

export { RedisCacheEntry }

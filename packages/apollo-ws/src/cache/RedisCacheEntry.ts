import { Snapshot } from './Snapshot'
import type { RedisClient } from './RedisClient'
import { isExpired } from './ttl'
import type { CacheEntry, SnapshotContent } from './types'

class RedisCacheEntry<T> implements CacheEntry<T> {
  public constructor(
    private readonly redis: RedisClient,
    private readonly key: string | undefined,
    private readonly snapshot: SnapshotContent<T>,
    private readonly ttlMs?: number,
  ) {}

  public async write(data: T): Promise<T> {
    this.snapshot.timestamp = new Date().getTime()
    this.snapshot.content = data

    if (this.key !== undefined) {
      const payload = JSON.stringify({ timestamp: this.snapshot.timestamp, content: data })

      if (this.ttlMs !== undefined && this.ttlMs > 0) {
        await this.redis.set(this.key, payload, { EX: Math.ceil(this.ttlMs / 1000) })
      } else {
        await this.redis.set(this.key, payload)
      }
    }

    return data
  }

  public getSnapshot(): Snapshot<T> | null {
    if (this.snapshot.content === undefined) {
      return null
    }

    if (isExpired(this.snapshot.timestamp, this.ttlMs)) {
      return this.expire()
    }

    return new Snapshot({
      timestamp: this.snapshot.timestamp,
      content: this.snapshot.content,
    })
  }

  private expire(): null {
    this.snapshot.content = undefined

    if (this.key !== undefined) {
      void this.redis.del(this.key)
    }

    return null
  }
}

export { RedisCacheEntry }

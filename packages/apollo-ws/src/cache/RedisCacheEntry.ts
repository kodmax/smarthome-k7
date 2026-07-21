import { Snapshot } from './Snapshot'
import type { RedisClient } from './RedisClient'
import type { CacheEntry, SnapshotContent } from './types'

class RedisCacheEntry<T> implements CacheEntry<T> {
  public constructor(
    private readonly redis: RedisClient,
    private readonly key: string | undefined,
    private readonly snapshot: SnapshotContent<T>,
  ) {}

  public async write(data: T): Promise<T> {
    this.snapshot.timestamp = new Date().getTime()
    this.snapshot.content = data

    if (this.key !== undefined) {
      await this.redis.set(this.key, JSON.stringify({ timestamp: this.snapshot.timestamp, content: data }))
    }

    return data
  }

  public getSnapshot(): Snapshot<T> | null {
    if (this.snapshot.content === undefined) {
      return null
    }

    return new Snapshot({
      timestamp: this.snapshot.timestamp,
      content: this.snapshot.content,
    })
  }
}

export { RedisCacheEntry }

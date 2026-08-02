import { Snapshot } from './Snapshot'
import { isExpired } from './ttl'
import type { CacheEntry, SnapshotContent } from './types'

class VolatileCacheEntry<T> implements CacheEntry<T> {
  public constructor(
    private readonly snapshot: SnapshotContent<T>,
    private readonly ttlMs?: number,
  ) {}

  public async write(data: T): Promise<T> {
    this.snapshot.timestamp = new Date().getTime()
    this.snapshot.content = data

    return data
  }

  public async getSnapshot(): Promise<Snapshot<T> | null> {
    if (this.snapshot.content === undefined) {
      return null
    }

    if (isExpired(this.snapshot.timestamp, this.ttlMs)) {
      this.snapshot.content = undefined

      return null
    }

    return new Snapshot({
      timestamp: this.snapshot.timestamp,
      content: this.snapshot.content,
    })
  }
}

export { VolatileCacheEntry }

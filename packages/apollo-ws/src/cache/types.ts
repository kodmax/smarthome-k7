import type { Snapshot } from './Snapshot'
import type { RedisClient } from './RedisClient'

export type { RedisClient }

export enum CacheAgeUnit {
  SECONDS = 1000,
  MINUTES = 60_000,
  HOURS = 3_600_000,
  DAYS = 86_400_000,
}

export type SnapshotContent<T> = {
  timestamp: number
  content?: T
}

export interface CacheEntry<T> {
  write(data: T): Promise<T>
  getSnapshot(): Snapshot<T> | null
}

export interface Cache {
  getEntry<T>(id?: string): Promise<CacheEntry<T>>
}

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

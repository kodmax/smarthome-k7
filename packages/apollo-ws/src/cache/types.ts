export enum CacheAgeUnit {
  SECONDS = 1,
  MINUTES = 60,
  HOURS = 3600,
  DAYS = 86400,
}

export type SnapshotContent<T> = {
  timestamp: number
  content?: T
}

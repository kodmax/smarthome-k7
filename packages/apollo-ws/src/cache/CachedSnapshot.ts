enum CacheAgeUnit {
  SECONDS = 1,
  MINUTES = 60,
  HOURS = 3600,
  DAYS = 86400,
}

type ContentSnapshot<T> = {
  timestamp?: number
  content?: T
}

class CachedSnapshot<T> {
  public constructor(private readonly entry: ContentSnapshot<T>) {
    //
  }

  public age(unit: CacheAgeUnit): number {
    return (new Date().getTime() - this.entry.timestamp) / 1000 / unit
  }

  public content(): T {
    return this.entry.content
  }
}

export type { ContentSnapshot }
export { CachedSnapshot, CacheAgeUnit }

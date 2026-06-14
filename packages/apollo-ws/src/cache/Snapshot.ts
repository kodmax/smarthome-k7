import { CacheAgeUnit, SnapshotContent } from './types'

export class Snapshot<T> {
  public constructor(private readonly snapshot: SnapshotContent<T>) {
    //
  }

  public age(unit: CacheAgeUnit): number {
    return (new Date().getTime() - this.snapshot.timestamp) / 1000 / unit
  }

  public getTimestamp(): number {
    return this.snapshot.timestamp
  }

  public isEmpty(): boolean {
    return this.snapshot.content === undefined
  }

  public getContent(): T {
    if (this.snapshot.content === undefined) {
      throw new Error('Snapshot is empty')
    }

    return this.snapshot.content
  }
}

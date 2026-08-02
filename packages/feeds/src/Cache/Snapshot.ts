export type SnapshotData<T> = {
  timestamp: number
  content: T
}

export class Snapshot<T> {
  public constructor(private readonly snapshot: SnapshotData<T>) {
    //
  }

  public getTimestamp(): number {
    return this.snapshot.timestamp
  }

  public getContent(): T {
    return this.snapshot.content
  }
}

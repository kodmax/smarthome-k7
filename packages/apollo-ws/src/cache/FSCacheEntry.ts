import * as path from 'path'
import * as fs from 'fs'
import { Snapshot } from './Snapshot'
import type { CacheEntry, SnapshotContent } from './types'

class FSCacheEntry<T> implements CacheEntry<T> {
  public constructor(
    private readonly path: string,
    private readonly snapshot: SnapshotContent<T>,
    private fileName?: string,
  ) {}

  public async write(data: T): Promise<T> {
    this.snapshot.timestamp = new Date().getTime()
    this.snapshot.content = data

    if (this.fileName) {
      await fs.promises.writeFile(path.resolve(this.path, `${this.fileName}.json`), JSON.stringify(data, null, 4))
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

export { FSCacheEntry }

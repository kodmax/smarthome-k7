import * as path from 'path'
import * as fs from 'fs'
import { Snapshot } from './Snapshot'
import { SnapshotContent } from './types'

class CacheEntry<T> {
  private readonly content: Snapshot<T>

  public constructor(
    private readonly path: string,
    private readonly snapshot: SnapshotContent<T>,
    private fileName?: string,
  ) {
    this.content = new Snapshot<T>(this.snapshot)
  }

  public async write(data: T): Promise<T> {
    this.snapshot.timestamp = new Date().getTime()
    this.snapshot.content = data

    if (this.fileName) {
      await fs.promises.writeFile(path.resolve(this.path, `${this.fileName}.json`), JSON.stringify(data, null, 4))
    }

    return data
  }

  public getSnapshot(): Snapshot<T> {
    return this.content
  }

  public isEmpty(): boolean {
    return this.snapshot.content === undefined
  }
}

export { CacheEntry }

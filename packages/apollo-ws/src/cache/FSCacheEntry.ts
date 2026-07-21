import * as path from 'path'
import * as fs from 'fs'
import { isFileSystemError } from '../fs-error'
import { Snapshot } from './Snapshot'
import { isExpired } from './ttl'
import type { CacheEntry, SnapshotContent } from './types'

class FSCacheEntry<T> implements CacheEntry<T> {
  public constructor(
    private readonly path: string,
    private readonly snapshot: SnapshotContent<T>,
    private fileName?: string,
    private readonly ttlMs?: number,
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

    if (isExpired(this.snapshot.timestamp, this.ttlMs)) {
      return this.expire()
    }

    return new Snapshot({
      timestamp: this.snapshot.timestamp,
      content: this.snapshot.content,
    })
  }

  private expire(): null {
    this.snapshot.content = undefined

    if (this.fileName) {
      try {
        fs.unlinkSync(path.resolve(this.path, `${this.fileName}.json`))
      } catch (e) {
        if (!isFileSystemError(e) || e.code !== 'ENOENT') {
          throw e
        }
      }
    }

    return null
  }
}

export { FSCacheEntry }

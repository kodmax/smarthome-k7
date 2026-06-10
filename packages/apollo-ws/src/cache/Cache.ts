import * as path from 'path'
import * as fs from 'fs'
import { isFileSystemError } from '../fs-error'
import { ContentSnapshot } from './CachedSnapshot'
import { CacheEntry } from './CacheEntry'

class Cache {
  private readonly path: string

  public constructor(dir: string) {
    this.path = path.resolve(dir)

    fs.mkdirSync(this.path, { recursive: true })
  }

  public async getEntry<T>(key?: string): Promise<CacheEntry<T>> {
    const snapshot: ContentSnapshot<T> = {}
    if (key) {
      try {
        const content = await fs.promises.readFile(path.resolve(this.path, `${key}.json`), { encoding: 'utf-8' })
        const stat = await fs.promises.stat(path.resolve(this.path, `${key}.json`))

        snapshot.content = JSON.parse(content) as T
        snapshot.timestamp = stat.mtime.getTime()
      } catch (e) {
        if (!isFileSystemError(e) || e.code !== 'ENOENT') {
          throw e
        }
      }
    }

    return new CacheEntry<T>(this.path, snapshot, key)
  }
}

export { Cache }

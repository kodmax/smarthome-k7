import * as path from 'path'
import * as fs from 'fs'
import { isFileSystemError } from '../fs-error'
import { CorruptCacheError } from '../Errors'
import { FSCacheEntry } from './FSCacheEntry'
import type { Cache, CacheEntry } from './types'

class FSCache implements Cache {
  private readonly path: string

  public constructor(dir: string) {
    this.path = path.resolve(dir)

    fs.mkdirSync(this.path, { recursive: true })
  }

  public async getEntry<T>(id?: string): Promise<CacheEntry<T>> {
    if (id === undefined) {
      return new FSCacheEntry<T>(this.path, { timestamp: new Date().getTime() }, id)
    }

    try {
      const content = await fs.promises.readFile(path.resolve(this.path, `${id}.json`), { encoding: 'utf-8' })
      const stat = await fs.promises.stat(path.resolve(this.path, `${id}.json`))

      return new FSCacheEntry<T>(
        this.path,
        {
          content: JSON.parse(content),
          timestamp: stat.mtime.getTime(),
        },
        id,
      )
    } catch (e) {
      if (isFileSystemError(e) && e.code === 'ENOENT') {
        return new FSCacheEntry<T>(this.path, { timestamp: new Date().getTime() }, id)
      }

      if (e instanceof SyntaxError) {
        throw new CorruptCacheError(id, e)
      }

      throw e
    }
  }
}

export { FSCache }

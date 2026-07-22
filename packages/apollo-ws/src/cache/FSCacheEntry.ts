import * as path from 'path'
import * as fs from 'fs'
import { isFileSystemError } from '../fs-error'
import { CorruptCacheError } from '../Errors'
import { Snapshot } from './Snapshot'
import { isExpired } from './ttl'
import type { CacheEntry } from './types'

class FSCacheEntry<T> implements CacheEntry<T> {
  public constructor(
    private readonly path: string,
    private readonly fileName: string,
    private readonly ttlMs?: number,
  ) {}

  public async write(data: T): Promise<T> {
    const timestamp = new Date().getTime()
    const filePath = path.resolve(this.path, `${this.fileName}.json`)

    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 4))
    await fs.promises.utimes(filePath, new Date(timestamp), new Date(timestamp))

    return data
  }

  public async getSnapshot(): Promise<Snapshot<T> | null> {
    const filePath = path.resolve(this.path, `${this.fileName}.json`)

    try {
      const content = await fs.promises.readFile(filePath, { encoding: 'utf-8' })
      const stat = await fs.promises.stat(filePath)
      const timestamp = stat.mtime.getTime()

      if (isExpired(timestamp, this.ttlMs)) {
        return this.expire()
      }

      return new Snapshot({
        timestamp,
        content: JSON.parse(content) as T,
      })
    } catch (e) {
      if (isFileSystemError(e) && e.code === 'ENOENT') {
        return null
      }

      if (e instanceof SyntaxError) {
        throw new CorruptCacheError(this.fileName, e)
      }

      throw e
    }
  }

  private async expire(): Promise<null> {
    try {
      await fs.promises.unlink(path.resolve(this.path, `${this.fileName}.json`))
    } catch (e) {
      if (!isFileSystemError(e) || e.code !== 'ENOENT') {
        throw e
      }
    }

    return null
  }
}

export { FSCacheEntry }

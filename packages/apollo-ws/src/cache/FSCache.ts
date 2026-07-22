import * as path from 'path'
import * as fs from 'fs'
import { isFileSystemError } from '../fs-error'
import { CorruptCacheError } from '../Errors'
import { FSCacheEntry } from './FSCacheEntry'
import { VolatileCacheEntry } from './VolatileCacheEntry'
import { isExpired } from './ttl'
import type { Cache, CacheEntry, CacheOptions } from './types'

class FSCache implements Cache {
  private readonly path: string

  public constructor(dir: string) {
    this.path = path.resolve(dir)

    fs.mkdirSync(this.path, { recursive: true })
  }

  public async getEntry<T>(id?: string, options?: CacheOptions): Promise<CacheEntry<T>> {
    const ttlMs = options?.ttlMs

    if (id === undefined) {
      return new VolatileCacheEntry<T>({ timestamp: new Date().getTime() }, ttlMs)
    }

    const filePath = path.resolve(this.path, `${id}.json`)

    try {
      const content = await fs.promises.readFile(filePath, { encoding: 'utf-8' })
      const stat = await fs.promises.stat(filePath)
      const timestamp = stat.mtime.getTime()

      if (isExpired(timestamp, ttlMs)) {
        await this.deleteFile(filePath)

        return new FSCacheEntry<T>(this.path, id, ttlMs)
      }

      JSON.parse(content)

      return new FSCacheEntry<T>(this.path, id, ttlMs)
    } catch (e) {
      if (isFileSystemError(e) && e.code === 'ENOENT') {
        return new FSCacheEntry<T>(this.path, id, ttlMs)
      }

      if (e instanceof SyntaxError) {
        throw new CorruptCacheError(id, e)
      }

      throw e
    }
  }

  private async deleteFile(filePath: string): Promise<void> {
    try {
      await fs.promises.unlink(filePath)
    } catch (e) {
      if (!isFileSystemError(e) || e.code !== 'ENOENT') {
        throw e
      }
    }
  }
}

export { FSCache }

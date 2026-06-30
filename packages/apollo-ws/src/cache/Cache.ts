import * as path from 'path'
import * as fs from 'fs'
import { isFileSystemError } from '../fs-error'
import { CorruptCacheError } from '../Errors'
import { CacheEntry } from './CacheEntry'

class Cache {
  private readonly path: string

  public constructor(dir: string) {
    this.path = path.resolve(dir)

    fs.mkdirSync(this.path, { recursive: true })
  }

  public async getEntry<T>(fileName?: string): Promise<CacheEntry<T>> {
    if (fileName === undefined) {
      return new CacheEntry<T>(this.path, { timestamp: new Date().getTime() }, fileName)
    }

    try {
      const content = await fs.promises.readFile(path.resolve(this.path, `${fileName}.json`), { encoding: 'utf-8' })
      const stat = await fs.promises.stat(path.resolve(this.path, `${fileName}.json`))

      return new CacheEntry<T>(
        this.path,
        {
          content: JSON.parse(content),
          timestamp: stat.mtime.getTime(),
        },
        fileName,
      )
    } catch (e) {
      if (isFileSystemError(e) && e.code === 'ENOENT') {
        return new CacheEntry<T>(this.path, { timestamp: new Date().getTime() }, fileName)
      }

      if (e instanceof SyntaxError) {
        throw new CorruptCacheError(fileName, e)
      }

      throw e
    }
  }
}

export { Cache }

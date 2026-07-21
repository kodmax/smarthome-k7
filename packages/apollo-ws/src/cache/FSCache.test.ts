import { existsSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it } from 'vitest'
import { CorruptCacheError } from '../Errors'
import { FSCache } from './FSCache'

describe('FSCache', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  function createCache() {
    const dir = mkdtempSync(join(tmpdir(), 'apollo-ws-cache-'))
    cacheDirs.push(dir)
    return new FSCache(dir)
  }

  it('returns an empty entry when cache file is missing (ENOENT)', async () => {
    const cache = createCache()

    const entry = await cache.getEntry<{ value: number }>('missing')

    expect(entry.getSnapshot()).toBeNull()
  })

  it('persists and reloads content from disk', async () => {
    const cache = createCache()

    const entry = await cache.getEntry<{ value: number }>('persisted')
    await entry.write({ value: 42 })

    const reloaded = await cache.getEntry<{ value: number }>('persisted')

    expect(reloaded.getSnapshot().getContent()).toEqual({ value: 42 })
  })

  it('does not write files for volatile entries', async () => {
    const cache = createCache()
    const dir = cacheDirs[cacheDirs.length - 1]

    const entry = await cache.getEntry<{ value: number }>(undefined)
    await entry.write({ value: 1 })

    expect(existsSync(join(dir, 'undefined.json'))).toBe(false)
    expect(readdirSync(dir)).toHaveLength(0)
  })

  it('throws CorruptCacheError for invalid JSON on disk', async () => {
    const cache = createCache()
    const dir = cacheDirs[cacheDirs.length - 1]

    writeFileSync(join(dir, 'broken.json'), '{ not-json')

    await expect(cache.getEntry('broken')).rejects.toThrow(CorruptCacheError)
  })
})

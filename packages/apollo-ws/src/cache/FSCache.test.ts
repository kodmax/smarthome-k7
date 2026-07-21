import { existsSync, mkdtempSync, readdirSync, rmSync, utimesSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CorruptCacheError } from '../Errors'
import { FSCache } from './FSCache'

describe('FSCache', () => {
  const cacheDirs: string[] = []

  afterEach(() => {
    vi.useRealTimers()
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

    const entry = await cache.getEntry<{ value: number }>('persisted', { ttlMs: Number.MAX_SAFE_INTEGER })
    await entry.write({ value: 42 })

    const reloaded = await cache.getEntry<{ value: number }>('persisted', { ttlMs: Number.MAX_SAFE_INTEGER })

    expect(reloaded.getSnapshot()?.getContent()).toEqual({ value: 42 })
  })

  it('does not write files for volatile entries', async () => {
    const cache = createCache()
    const dir = cacheDirs[cacheDirs.length - 1]

    const entry = await cache.getEntry<{ value: number }>(undefined)
    await entry.write({ value: 1 })

    expect(existsSync(join(dir, 'undefined.json'))).toBe(false)
    expect(readdirSync(dir)).toHaveLength(0)
  })

  it('serves volatile snapshot from memory and expires without touching disk', async () => {
    vi.useFakeTimers()
    const cache = createCache()
    const dir = cacheDirs[cacheDirs.length - 1]

    const entry = await cache.getEntry<{ value: number }>(undefined, { ttlMs: 1000 })
    await entry.write({ value: 1 })

    expect(entry.getSnapshot()?.getContent()).toEqual({ value: 1 })
    expect(readdirSync(dir)).toHaveLength(0)

    vi.advanceTimersByTime(1001)

    expect(entry.getSnapshot()).toBeNull()
    expect(readdirSync(dir)).toHaveLength(0)
  })

  it('throws CorruptCacheError for invalid JSON on disk', async () => {
    const cache = createCache()
    const dir = cacheDirs[cacheDirs.length - 1]

    writeFileSync(join(dir, 'broken.json'), '{ not-json')

    await expect(cache.getEntry('broken')).rejects.toThrow(CorruptCacheError)
  })

  it('returns null and deletes file after TTL expires in getSnapshot()', async () => {
    vi.useFakeTimers()
    const cache = createCache()
    const dir = cacheDirs[cacheDirs.length - 1]

    const entry = await cache.getEntry<{ value: number }>('expiring', { ttlMs: 1000 })
    await entry.write({ value: 1 })

    expect(existsSync(join(dir, 'expiring.json'))).toBe(true)

    vi.advanceTimersByTime(1001)

    expect(entry.getSnapshot()).toBeNull()
    expect(existsSync(join(dir, 'expiring.json'))).toBe(false)
  })

  it('deletes expired file on getEntry()', async () => {
    const cache = createCache()
    const dir = cacheDirs[cacheDirs.length - 1]
    const filePath = join(dir, 'stale.json')

    writeFileSync(filePath, JSON.stringify({ value: 1 }))
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    utimesSync(filePath, twoHoursAgo, twoHoursAgo)

    const entry = await cache.getEntry<{ value: number }>('stale', { ttlMs: 60_000 })

    expect(entry.getSnapshot()).toBeNull()
    expect(existsSync(filePath)).toBe(false)
  })
})

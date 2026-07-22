import { afterEach, describe, expect, it, vi } from 'vitest'
import { CorruptCacheError } from '../Errors'
import { RedisCache } from './RedisCache'
import type { RedisClient } from './RedisClient'

describe('RedisCache', () => {
  const stores: Map<string, string>[] = []
  const setCalls: Array<{ key: string; value: string; options?: { EX?: number } }>[] = []

  afterEach(() => {
    vi.useRealTimers()
    stores.splice(0)
    setCalls.splice(0)
  })

  function createMockRedis(initial?: Record<string, string>): RedisClient {
    const store = new Map(Object.entries(initial ?? {}))
    const calls: Array<{ key: string; value: string; options?: { EX?: number } }> = []
    stores.push(store)
    setCalls.push(calls)

    return {
      get: async key => store.get(key) ?? null,
      set: async (key, value, options) => {
        store.set(key, value)
        calls.push({ key, value, options })
      },
      del: async key => {
        store.delete(key)
      },
    }
  }

  function createCache(redis = createMockRedis()) {
    return new RedisCache(redis)
  }

  it('returns a null snapshot when cache key is missing', async () => {
    const cache = createCache()

    const entry = await cache.getEntry<{ value: number }>('missing')

    expect(await entry.getSnapshot()).toBeNull()
  })

  it('persists and reloads content from redis', async () => {
    const redis = createMockRedis()
    const cache = createCache(redis)

    const entry = await cache.getEntry<{ value: number }>('persisted', { ttlMs: Number.MAX_SAFE_INTEGER })
    await entry.write({ value: 42 })

    const reloaded = await cache.getEntry<{ value: number }>('persisted', { ttlMs: Number.MAX_SAFE_INTEGER })

    expect((await reloaded.getSnapshot())?.getContent()).toEqual({ value: 42 })
    expect(JSON.parse(stores[0].get('apollo-ws:cache:persisted')!)).toMatchObject({ content: { value: 42 } })
  })

  it('sets EX when writing with ttlMs', async () => {
    const cache = createCache()

    const entry = await cache.getEntry<{ value: number }>('ttl-key', { ttlMs: 60_000 })
    await entry.write({ value: 42 })

    expect(setCalls[0]).toEqual([
      {
        key: 'apollo-ws:cache:ttl-key',
        value: expect.stringContaining('"value":42'),
        options: { EX: 60 },
      },
    ])
  })

  it('does not set EX when ttlMs is 0', async () => {
    const cache = createCache()

    const entry = await cache.getEntry<{ value: number }>('no-ttl', { ttlMs: 0 })
    await entry.write({ value: 1 })

    expect(setCalls[0][0].options).toBeUndefined()
  })

  it('returns VolatileCacheEntry when source id is missing', async () => {
    const redis = createMockRedis()
    const cache = createCache(redis)
    const store = stores[0]

    const entry = await cache.getEntry<{ value: number }>(undefined)
    await entry.write({ value: 1 })

    expect((await entry.getSnapshot())?.getContent()).toEqual({ value: 1 })
    expect(store.size).toBe(0)
    expect(setCalls[0]).toHaveLength(0)
  })

  it('expires volatile entry without touching redis', async () => {
    vi.useFakeTimers()
    const cache = createCache()

    const entry = await cache.getEntry<{ value: number }>(undefined, { ttlMs: 1000 })
    await entry.write({ value: 1 })

    vi.advanceTimersByTime(1001)

    expect(await entry.getSnapshot()).toBeNull()
    expect(stores[0].size).toBe(0)
    expect(setCalls[0]).toHaveLength(0)

    vi.useRealTimers()
  })

  it('throws CorruptCacheError for invalid JSON in redis', async () => {
    const cache = createCache(createMockRedis({ 'apollo-ws:cache:broken': '{ not-json' }))

    await expect(cache.getEntry('broken')).rejects.toThrow(CorruptCacheError)
  })

  it('returns null and deletes key after TTL expires in getSnapshot()', async () => {
    vi.useFakeTimers()
    const cache = createCache()

    const entry = await cache.getEntry<{ value: number }>('expiring', { ttlMs: 1000 })
    await entry.write({ value: 1 })

    expect(stores[0].has('apollo-ws:cache:expiring')).toBe(true)

    vi.advanceTimersByTime(1001)

    expect(await entry.getSnapshot()).toBeNull()
    expect(stores[0].has('apollo-ws:cache:expiring')).toBe(false)
  })

  it('deletes expired key on getEntry()', async () => {
    const twoHoursAgo = Date.now() - 2 * 60 * 60 * 1000
    const cache = createCache(
      createMockRedis({
        'apollo-ws:cache:stale': JSON.stringify({ timestamp: twoHoursAgo, content: { value: 1 } }),
      }),
    )

    const entry = await cache.getEntry<{ value: number }>('stale', { ttlMs: 60_000 })

    expect(await entry.getSnapshot()).toBeNull()
    expect(stores[0].has('apollo-ws:cache:stale')).toBe(false)
  })
})

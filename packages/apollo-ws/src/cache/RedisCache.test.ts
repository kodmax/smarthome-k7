import { afterEach, describe, expect, it } from 'vitest'
import { CorruptCacheError } from '../Errors'
import { RedisCache } from './RedisCache'
import type { RedisClient } from './RedisClient'

describe('RedisCache', () => {
  const stores: Map<string, string>[] = []

  afterEach(() => {
    stores.splice(0)
  })

  function createMockRedis(initial?: Record<string, string>): RedisClient {
    const store = new Map(Object.entries(initial ?? {}))
    stores.push(store)

    return {
      get: async key => store.get(key) ?? null,
      set: async (key, value) => {
        store.set(key, value)
      },
    }
  }

  function createCache(redis = createMockRedis()) {
    return new RedisCache(redis)
  }

  it('returns a null snapshot when cache key is missing', async () => {
    const cache = createCache()

    const entry = await cache.getEntry<{ value: number }>('missing')

    expect(entry.getSnapshot()).toBeNull()
  })

  it('persists and reloads content from redis', async () => {
    const redis = createMockRedis()
    const cache = createCache(redis)

    const entry = await cache.getEntry<{ value: number }>('persisted')
    await entry.write({ value: 42 })

    const reloaded = await cache.getEntry<{ value: number }>('persisted')

    expect(reloaded.getSnapshot()?.getContent()).toEqual({ value: 42 })
    expect(JSON.parse(stores[0].get('apollo-ws:cache:persisted')!)).toMatchObject({ content: { value: 42 } })
  })

  it('does not write keys for volatile entries', async () => {
    const redis = createMockRedis()
    const cache = createCache(redis)
    const store = stores[0]

    const entry = await cache.getEntry<{ value: number }>(undefined)
    await entry.write({ value: 1 })

    expect(store.size).toBe(0)
  })

  it('throws CorruptCacheError for invalid JSON in redis', async () => {
    const cache = createCache(createMockRedis({ 'apollo-ws:cache:broken': '{ not-json' }))

    await expect(cache.getEntry('broken')).rejects.toThrow(CorruptCacheError)
  })
})

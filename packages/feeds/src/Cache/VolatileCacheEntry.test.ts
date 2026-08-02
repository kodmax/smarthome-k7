import { describe, expect, it, vi } from 'vitest'
import { VolatileCacheEntry } from './VolatileCacheEntry'

describe('VolatileCacheEntry', () => {
  it('returns null before write', async () => {
    const entry = new VolatileCacheEntry<{ value: number }>({ timestamp: Date.now() })

    expect(await entry.getSnapshot()).toBeNull()
  })

  it('serves snapshot from memory', async () => {
    const entry = new VolatileCacheEntry<{ value: number }>({ timestamp: Date.now() }, Number.MAX_SAFE_INTEGER)
    await entry.write({ value: 42 })

    expect((await entry.getSnapshot())?.getContent()).toEqual({ value: 42 })
  })

  it('expires snapshot after TTL', async () => {
    vi.useFakeTimers()
    const entry = new VolatileCacheEntry<{ value: number }>({ timestamp: Date.now() }, 1000)
    await entry.write({ value: 1 })

    vi.advanceTimersByTime(1001)

    expect(await entry.getSnapshot()).toBeNull()

    vi.useRealTimers()
  })
})

import { describe, expect, it } from 'vitest'
import { observeDbQuery, SLOW_QUERY_THRESHOLD_SEC } from './dbMetrics'

describe('observeDbQuery', () => {
  it('returns the callback result', async () => {
    await expect(observeDbQuery('select', 'readings', async () => [{ id: 1 }])).resolves.toEqual([{ id: 1 }])
  })

  it('rethrows errors from the callback', async () => {
    await expect(
      observeDbQuery('select', 'readings', async () => {
        throw new Error('query failed')
      }),
    ).rejects.toThrow('query failed')
  })
})

describe('SLOW_QUERY_THRESHOLD_SEC', () => {
  it('is one second', () => {
    expect(SLOW_QUERY_THRESHOLD_SEC).toBe(1)
  })
})

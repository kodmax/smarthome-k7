import { describe, expect, it, vi } from 'vitest'
import { observeDataSourceRefresh } from './dataSourceMetrics'

describe('observeDataSourceRefresh', () => {
  it('returns the function result', async () => {
    await expect(observeDataSourceRefresh('scraper', 'weather', async () => ({ ok: true }))).resolves.toEqual({
      ok: true,
    })
  })

  it('propagates errors', async () => {
    const error = new Error('refresh failed')
    await expect(
      observeDataSourceRefresh('scraper', 'weather', async () => {
        throw error
      }),
    ).rejects.toThrow(error)
  })

  it('skips metrics for other type', async () => {
    const fn = vi.fn(async () => 'value')
    await expect(observeDataSourceRefresh('other', 'transmission', fn)).resolves.toBe('value')
    expect(fn).toHaveBeenCalledOnce()
  })

  it('is a no-op wrapper when NO_METRICS=1', async () => {
    vi.stubEnv('NO_METRICS', '1')
    const fn = vi.fn(async () => 'value')

    await expect(observeDataSourceRefresh('scraper', 'weather', fn)).resolves.toBe('value')
    expect(fn).toHaveBeenCalledOnce()

    vi.unstubAllEnvs()
  })
})

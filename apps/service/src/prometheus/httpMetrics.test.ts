import { describe, expect, it, vi } from 'vitest'
import { observeHttpFetch, observeHttpRequest } from './httpMetrics'

describe('observeHttpFetch', () => {
  it('returns the callback result', async () => {
    await expect(observeHttpFetch('https://example.com/page', 'html', async () => 'parsed')).resolves.toBe('parsed')
  })

  it('records FetchError status codes', async () => {
    const { FetchError } = await import('@/fetch/FetchError')
    await expect(
      observeHttpFetch('https://example.com/page', 'json', async () => {
        throw new FetchError('Not Found', 404)
      }),
    ).rejects.toThrow(FetchError)
  })
})

describe('observeHttpRequest', () => {
  it('returns the fetch response', async () => {
    const response = new Response('ok', { status: 200 })
    const fetchFn = vi.fn(async () => response)

    await expect(observeHttpRequest('https://example.com/data', fetchFn)).resolves.toBe(response)
    expect(fetchFn).toHaveBeenCalledOnce()
  })

  it('propagates fetch errors', async () => {
    const error = new Error('network failed')
    await expect(
      observeHttpRequest('https://example.com/data', async () => {
        throw error
      }),
    ).rejects.toThrow(error)
  })
})

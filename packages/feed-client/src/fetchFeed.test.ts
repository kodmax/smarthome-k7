import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { FeedFetchError, fetchFeed } from './fetchFeed'

describe('fetchFeed', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns parsed JSON on success', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: async () => ({ value: 1 }),
    } as Response)

    await expect(fetchFeed('weather')).resolves.toEqual({ value: 1 })
    expect(fetch).toHaveBeenCalledWith(expect.stringMatching(/\/feeds\/weather$/), { cache: 'no-store' })
  })

  it('throws FeedFetchError on HTTP error', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 404,
    } as Response)

    await expect(fetchFeed('missing')).rejects.toMatchObject({
      name: 'FeedFetchError',
      feedId: 'missing',
      status: 404,
    })
  })

  it('deduplicates concurrent requests for the same feed', async () => {
    let resolveJson!: (value: unknown) => void
    const jsonPromise = new Promise<unknown>(resolve => {
      resolveJson = resolve
    })

    vi.mocked(fetch).mockReturnValue(
      Promise.resolve({
        ok: true,
        json: () => jsonPromise,
      }) as Promise<Response>,
    )

    const first = fetchFeed('weather')
    const second = fetchFeed('weather')

    await Promise.resolve()

    expect(fetch).toHaveBeenCalledOnce()

    resolveJson({ value: 2 })

    await expect(Promise.all([first, second])).resolves.toEqual([{ value: 2 }, { value: 2 }])
  })
})

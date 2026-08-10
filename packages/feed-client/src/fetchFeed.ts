import { getDefaultApiBaseUrl } from './getDefaultApiBaseUrl'

export class FeedFetchError extends Error {
  constructor(
    readonly feedId: string,
    readonly status: number,
  ) {
    super(`Feed fetch failed: ${feedId} (${status})`)
    this.name = 'FeedFetchError'
  }
}

const logFetchError = (...args: unknown[]): void => {
  if (import.meta.env.DEV) {
    console.error(...args)
  }
}

const fetchFeedInFlight = new Map<string, Promise<unknown>>()

export function fetchFeed(feedId: string): Promise<unknown> {
  const existing = fetchFeedInFlight.get(feedId)
  if (existing !== undefined) {
    return existing
  }

  const slot: { promise?: Promise<unknown> } = {}
  const promise = (async () => {
    const url = `${getDefaultApiBaseUrl()}/feeds/${encodeURIComponent(feedId)}`

    try {
      const response = await fetch(url, { cache: 'no-store' })

      if (!response.ok) {
        throw new FeedFetchError(feedId, response.status)
      }

      return await response.json()
    } catch (error) {
      if (!(error instanceof FeedFetchError)) {
        logFetchError('[feed-client] feed fetch error', { feedId, url, error })
      }

      throw error
    } finally {
      if (fetchFeedInFlight.get(feedId) === slot.promise) {
        fetchFeedInFlight.delete(feedId)
      }
    }
  })()

  slot.promise = promise
  fetchFeedInFlight.set(feedId, promise)
  return promise
}

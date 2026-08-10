import { serviceApiUrl } from '../config.js'

export class FeedFetchError extends Error {
  constructor(
    readonly feedId: string,
    readonly status: number,
  ) {
    super(`Feed fetch failed: ${feedId} (${status})`)
    this.name = 'FeedFetchError'
  }
}

export async function fetchFeed<T>(feedId: string): Promise<T> {
  const response = await fetch(`${serviceApiUrl}/feeds/${encodeURIComponent(feedId)}`, { cache: 'no-store' })

  if (!response.ok) {
    throw new FeedFetchError(feedId, response.status)
  }

  return response.json() as Promise<T>
}

export async function fetchFeeds<T extends string>(feedIds: readonly T[]): Promise<Partial<Record<T, unknown>>> {
  const result: Partial<Record<T, unknown>> = {}

  await Promise.all(
    feedIds.map(async id => {
      try {
        result[id] = await fetchFeed(id)
      } catch {
        // omit unavailable feeds
      }
    }),
  )

  return result
}

const sleep = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms))

export type PollFeedUntilOptions = {
  initialDelayMs?: number
  intervalMs?: number
  timeoutMs?: number
}

export async function pollFeedUntil<T>(
  feedId: string,
  predicate: (feed: T) => boolean,
  { initialDelayMs = 500, intervalMs = 500, timeoutMs = 20_000 }: PollFeedUntilOptions = {},
): Promise<T> {
  const deadline = Date.now() + timeoutMs

  if (initialDelayMs > 0) {
    await sleep(initialDelayMs)
  }

  while (Date.now() <= deadline) {
    const feed = await fetchFeed<T>(feedId)
    if (predicate(feed)) {
      return feed
    }

    if (Date.now() + intervalMs > deadline) {
      break
    }

    await sleep(intervalMs)
  }

  throw new Error(`Timeout waiting for feed ${feedId}`)
}

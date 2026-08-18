import { observeHttpRequest } from '../../../prometheus/httpMetrics'
import { isEverywhere, isRecentEnough } from './filters'
import { parseApolloPage } from './parseApolloPage'
import type { WellfoundListing } from './types'

const BASE_URL = 'https://wellfound.com/role/r/software-engineer'
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'
const MAX_RETRIES = 3
const BACKOFF_MS = [5_000, 15_000, 45_000]
const DEFAULT_DELAY_MS = 800

export type FetchWellfoundAdsOptions = {
  delayMs?: number
  maxPages?: number
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

async function fetchPage(page: number): Promise<{ html: string } | { error: string }> {
  const url = `${BASE_URL}?page=${page}`

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt += 1) {
    try {
      const response = await observeHttpRequest(
        url,
        () =>
          fetch(url, {
            headers: { 'User-Agent': USER_AGENT },
          }),
        'html',
      )

      if (response.status === 429) {
        if (attempt >= MAX_RETRIES) {
          return { error: `HTTP 429 after ${MAX_RETRIES} retries` }
        }

        const retryAfterHeader = response.headers.get('Retry-After')
        const retryAfterSec = retryAfterHeader ? Number(retryAfterHeader) : NaN
        const backoffMs = Number.isFinite(retryAfterSec) ? retryAfterSec * 1_000 : (BACKOFF_MS[attempt] ?? 45_000)
        await sleep(backoffMs)
        continue
      }

      if (!response.ok) {
        return { error: `HTTP ${response.status}` }
      }

      return { html: await response.text() }
    } catch (error) {
      if (attempt >= MAX_RETRIES) {
        return { error: error instanceof Error ? error.message : 'Unknown fetch error' }
      }

      await sleep(BACKOFF_MS[attempt] ?? 45_000)
    }
  }

  return { error: 'Unexpected fetch loop exit' }
}

function filterListing(listing: WellfoundListing): boolean {
  return isEverywhere(listing.job) && isRecentEnough(listing.job)
}

export async function fetchWellfoundAds(options: FetchWellfoundAdsOptions = {}): Promise<WellfoundListing[]> {
  const delayMs = options.delayMs ?? DEFAULT_DELAY_MS
  const byJobId = new Map<string, WellfoundListing>()
  let pageCount = options.maxPages ?? 0

  for (let page = 1; page <= (pageCount || 1); page += 1) {
    if (page > 1) {
      await sleep(delayMs)
    }

    const result = await fetchPage(page)
    if ('error' in result) {
      continue
    }

    const parsed = parseApolloPage(result.html)
    if (page === 1) {
      pageCount = options.maxPages ?? parsed.searchResults.pageCount
    }

    for (const listing of parsed.listings) {
      if (byJobId.has(listing.job.id)) {
        continue
      }

      if (!filterListing(listing)) {
        continue
      }

      byJobId.set(listing.job.id, listing)
    }
  }

  return [...byJobId.values()]
}

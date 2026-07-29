import { URL } from 'url'
import { parseHTML } from 'linkedom'
import { observeHttpRequest } from '@/prometheus/scraperMetrics'
import { FetchError } from './FetchError'

export async function yahooFetch(url: string): Promise<Document> {
  const purl = new URL(url)
  // Yahoo serves a stripped page for Accept: text/html (no fin-streamer / prefetched JSON).
  // */* returns the full SSR HTML the scraper expects.
  const req = await observeHttpRequest(
    url,
    () =>
      fetch(url, {
        headers: {
          accept: '*/*',
          'user-agent': 'smarthome-k7',
          host: purl.host,
        },
      }),
    'html',
  )

  if (!req.ok) {
    throw new FetchError(req.statusText, req.status, await req.text())
  }

  return parseHTML(await req.text()).window.document
}

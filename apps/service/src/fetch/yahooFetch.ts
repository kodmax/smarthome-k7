import { URL } from 'url'
import { observeHttpRequest } from '@/prometheus/httpMetrics'
import { FetchError } from './FetchError'
import { parseHtmlDocument } from './parseHtmlDocument'

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

  return parseHtmlDocument(await req.text())
}

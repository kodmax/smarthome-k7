import { URL } from 'url'
import { FetchError } from './FetchError'

export async function fetchText(
  url: string,
  extraHeaders?: Record<string, string>,
  method = 'GET',
): Promise<string> {
  const purl = new URL(url)
  const req = await fetch(url, {
    method,
    headers: {
      accept: 'text/html, */*',
      'user-agent': 'smarthome-k7',
      host: purl.host,
      ...extraHeaders,
    },
  })

  if (!req.ok) {
    throw new FetchError(req.statusText, req.status, await req.text())
  }

  return req.text()
}

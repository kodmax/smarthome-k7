import { URL } from 'url'
import { FetchError } from './FetchError'

export async function getJSON<T>(url: string, extraHeaders?: Record<string, string>, method = 'GET'): Promise<T> {
  const purl = new URL(url)
  const req = await fetch(url, {
    method,
    headers: {
      accept: 'application/json, */*',
      'user-agent': 'smarthome-k7',
      host: purl.host,
      ...extraHeaders,
    },
  })

  if (!req.ok) {
    throw new FetchError(req.statusText, req.status, await req.text())
  }

  return req.json() as Promise<T>
}

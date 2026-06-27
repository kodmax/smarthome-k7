import { URL } from 'url'
import { parseHTML } from 'linkedom'

export class FetchError<T> extends Error {
  public constructor(
    public statusText: string,
    public statusCode: number,
    public content?: T,
  ) {
    super(statusText)
  }
}

export async function getHTML(url: string, extraHeaders?: Record<string, string>, method = 'GET'): Promise<Document> {
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

  return parseHTML(await req.text()).window.document
}

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

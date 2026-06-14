import { URL } from 'url'

export class FetchError<T> extends Error {
  public constructor(
    public statusText: string,
    public statusCode: number,
    public content?: T,
  ) {
    super(statusText)
  }
}

export async function myFetch(
  url: string,
  extraHeaders?: Record<string, string>,
  method = 'GET',
): Promise<Uint8Array<ArrayBuffer>> {
  const purl = new URL(url)
  const req = await fetch(url, {
    method,
    headers: {
      accept: 'application/json, */*',
      'accept-encoding': 'identity',
      'user-agent': 'Apollo/ws',
      connection: 'close',
      host: purl.host,
      ...extraHeaders,
    },
  })

  if (!req.ok) {
    throw new FetchError(req.statusText, req.status, await req.text())
  }
  return req.bytes()
}

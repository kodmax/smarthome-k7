import { IncomingMessage } from 'http'
import { request } from 'https'
import { URL } from 'url'

export class FetchError<T> extends Error {
  public constructor(
    message: string,
    public res?: IncomingMessage,
    public content?: T,
  ) {
    super(message)
  }
}

export async function myFetch(url: string, extraHeaders?: Record<string, string>): Promise<Buffer> {
  const chunks: Buffer[] = []
  const purl = new URL(url)

  const headers: typeof extraHeaders = {
    accept: 'application/json, */*',
    'accept-encoding': 'identity',
    'user-agent': 'Apollo/ws',
    connection: 'close',
    host: purl.host,
    ...extraHeaders,
  }

  return new Promise((resolve, reject) => {
    const req = request(
      {
        protocol: purl.protocol,
        hostname: purl.hostname,
        path: `${purl.pathname}${purl.search}`,
        port: purl.port,
        headers,
      },
      res => {
        res.on('data', chunk => {
          chunks.push(chunk)
        })

        res.on('end', () => {
          if (res.statusCode === void 0) {
            reject(new FetchError<Buffer>(`${url} fetch error`))
          } else if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
            resolve(Buffer.concat(chunks))
          } else if (res.statusCode >= 300 && res.statusCode < 400) {
            reject(new FetchError<Buffer>(`${res.statusCode} REDIRECT from ${url} to ${res.headers.location}`))
          } else {
            reject(
              new FetchError<Buffer>(
                `Downloading ${url} failed: ${res.statusCode} ${res.statusMessage}`,
                res,
                Buffer.concat(chunks),
              ),
            )
          }

          clearTimeout(timeoutId)
        })

        res.on('error', () => {
          reject(new FetchError<Buffer>(`Downloading ${url} failed: ${res.statusCode} ${res.statusMessage}`, res))

          clearTimeout(timeoutId)
        })
      },
    )

    req.on('error', err => {
      reject(err)
    })

    req.end()

    const timeoutId = setTimeout(() => {
      req.destroy(new Error('HTTP Request aborted after 30000ms.'))
    }, 30000)
  })
}

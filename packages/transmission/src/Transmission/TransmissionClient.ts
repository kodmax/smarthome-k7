import { getTransmissionConfig } from '../config'
import { type TransmissionClientConfig, type TransmissionRequest, type TransmissionResponse } from './types'

export class TransmissionCallError extends Error {
  readonly errorCode: number | undefined

  constructor(message: string, errorCode?: number) {
    super(message)
    this.name = 'TransmissionCallError'
    this.errorCode = errorCode
  }
}

const basicAuthHeader = (username: string | undefined, password: string | undefined): string | undefined => {
  if (username === undefined || username === '') {
    return undefined
  }

  const credentials = Buffer.from(`${username}:${password ?? ''}`).toString('base64')
  return `Basic ${credentials}`
}

export class TransmissionClient {
  private sessionId: string | undefined
  private nextTag = 1
  private readonly fetchFn: typeof fetch
  private readonly config: TransmissionClientConfig

  constructor(config: TransmissionClientConfig) {
    this.config = config
    this.fetchFn = config.fetch ?? fetch
  }

  async call<T = Record<string, unknown>>(method: string, args: Record<string, unknown> = {}): Promise<T> {
    const tag = this.nextTag++
    const body: TransmissionRequest = { method, arguments: args, tag }

    const response = await this.post(body)

    if (response.status === 409) {
      const sessionId = response.headers.get('X-Transmission-Session-Id')
      if (sessionId === null || sessionId === '') {
        throw new Error('Transmission returned 409 without X-Transmission-Session-Id')
      }

      this.sessionId = sessionId
      return this.parseResponse<T>(await this.post(body))
    }

    return this.parseResponse<T>(response)
  }

  private async post(body: TransmissionRequest): Promise<Response> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (this.sessionId !== undefined) {
      headers['X-Transmission-Session-Id'] = this.sessionId
    }

    const auth = basicAuthHeader(this.config.username, this.config.password)
    if (auth !== undefined) {
      headers.Authorization = auth
    }

    return this.fetchFn(this.config.url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      throw new Error(`Transmission request failed: HTTP ${response.status} ${response.statusText}`)
    }

    const payload = (await response.json()) as TransmissionResponse<T>
    if (payload.result === 'error') {
      throw new TransmissionCallError(payload.error, payload.errorCode)
    }

    return payload.arguments
  }
}

let client: TransmissionClient | undefined

export const getTransmissionClient = (): TransmissionClient => {
  if (client === undefined) {
    client = new TransmissionClient(getTransmissionConfig())
  }

  return client
}

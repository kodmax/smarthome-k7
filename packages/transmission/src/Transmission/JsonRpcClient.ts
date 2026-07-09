import {
  type JsonRpcClientOptions,
  type JsonRpcErrorObject,
  type JsonRpcId,
  type JsonRpcRequest,
  type JsonRpcResponse,
} from './types'

export class JsonRpcCallError extends Error {
  readonly code: number
  readonly data: unknown

  constructor(error: JsonRpcErrorObject) {
    super(error.message)
    this.name = 'JsonRpcCallError'
    this.code = error.code
    this.data = error.data
  }
}

export class JsonRpcClient {
  private nextId = 1
  private readonly fetchFn: typeof fetch
  private readonly url: string
  private readonly headers: Record<string, string>

  constructor(options: JsonRpcClientOptions) {
    this.url = options.url
    this.headers = options.headers ?? {}
    this.fetchFn = options.fetch ?? fetch
  }

  async call<T>(method: string, params?: unknown, id?: JsonRpcId): Promise<T> {
    const requestId = id ?? this.nextId++
    const body: JsonRpcRequest = {
      jsonrpc: '2.0',
      method,
      ...(params !== undefined ? { params } : {}),
      id: requestId,
    }

    const response = await this.fetchFn(this.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.headers,
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`JSON-RPC request failed: HTTP ${response.status} ${response.statusText}`)
    }

    const payload = (await response.json()) as JsonRpcResponse<T>

    if ('error' in payload) {
      throw new JsonRpcCallError(payload.error)
    }

    return payload.result
  }
}

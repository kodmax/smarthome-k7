export type JsonRpcId = string | number | null

export type JsonRpcErrorObject = {
  code: number
  message: string
  data?: unknown
}

export type JsonRpcRequest = {
  jsonrpc: '2.0'
  method: string
  params?: unknown
  id?: JsonRpcId
}

export type JsonRpcSuccessResponse<T = unknown> = {
  jsonrpc: '2.0'
  result: T
  id: JsonRpcId
}

export type JsonRpcErrorResponse = {
  jsonrpc: '2.0'
  error: JsonRpcErrorObject
  id: JsonRpcId
}

export type JsonRpcResponse<T = unknown> = JsonRpcSuccessResponse<T> | JsonRpcErrorResponse

export type JsonRpcClientOptions = {
  url: string
  headers?: Record<string, string>
  fetch?: typeof fetch
}

export type TransmissionRequest = {
  method: string
  arguments?: Record<string, unknown>
  tag?: number
}

export type TransmissionSuccessResponse<T = Record<string, unknown>> = {
  result: 'success'
  arguments: T
  tag?: number
}

export type TransmissionErrorResponse = {
  result: 'error'
  error: string
  errorCode?: number
  tag?: number
}

export type TransmissionResponse<T = Record<string, unknown>> =
  | TransmissionSuccessResponse<T>
  | TransmissionErrorResponse

export type TransmissionClientConfig = {
  url: string
  username?: string
  password?: string
  fetch?: typeof fetch
}

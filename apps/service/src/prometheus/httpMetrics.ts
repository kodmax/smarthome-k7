import { Counter, Histogram, register } from 'prom-client'
import { FetchError } from '@/fetch/FetchError'
import { isMetricsEnabled } from './metricsEnabled'

export type HttpContentFormat = 'json' | 'html'

const httpRequests = new Counter({
  name: 'apollo_daemon_http_requests_total',
  help: 'Total HTTP requests made by data sources',
  labelNames: ['host', 'status', 'format'],
  registers: [register],
})

const httpDuration = new Histogram({
  name: 'apollo_daemon_http_request_duration_seconds',
  help: 'HTTP request duration for data sources in seconds',
  labelNames: ['host', 'format'],
  buckets: [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 7, 10],
  registers: [register],
})

const recordHttpRequest = (host: string, status: string, format: HttpContentFormat, durationSec: number): void => {
  httpRequests.inc({ host, status, format })
  httpDuration.observe({ host, format }, durationSec)
}

export const observeHttpRequest = async (
  url: string | URL,
  fn: () => Promise<Response>,
  format: HttpContentFormat = 'html',
): Promise<Response> => {
  if (!isMetricsEnabled()) {
    return fn()
  }

  const host = new URL(url.toString()).host
  const start = Date.now()

  try {
    const response = await fn()
    recordHttpRequest(host, String(response.status), format, (Date.now() - start) / 1000)
    return response
  } catch (error) {
    recordHttpRequest(host, 'error', format, (Date.now() - start) / 1000)
    throw error
  }
}

export const observeHttpFetch = async <T>(
  url: string | URL,
  format: HttpContentFormat,
  fn: () => Promise<T>,
): Promise<T> => {
  if (!isMetricsEnabled()) {
    return fn()
  }

  const host = new URL(url.toString()).host
  const start = Date.now()

  try {
    const result = await fn()
    recordHttpRequest(host, '200', format, (Date.now() - start) / 1000)
    return result
  } catch (error) {
    const status = error instanceof FetchError ? String(error.statusCode) : 'error'
    recordHttpRequest(host, status, format, (Date.now() - start) / 1000)
    throw error
  }
}

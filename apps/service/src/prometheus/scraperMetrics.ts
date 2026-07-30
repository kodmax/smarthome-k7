import { Counter, Gauge, Histogram, register } from 'prom-client'
import { FetchError } from '@/fetch/FetchError'
import { isMetricsEnabled } from './metricsEnabled'

export type HttpContentFormat = 'json' | 'html'

const scraperHttpRequests = new Counter({
  name: 'apollo_daemon_scraper_http_requests_total',
  help: 'Total HTTP requests made by scrapers',
  labelNames: ['host', 'status', 'format'],
  registers: [register],
})

const scraperHttpDuration = new Histogram({
  name: 'apollo_daemon_scraper_http_request_duration_seconds',
  help: 'HTTP request duration for scrapers in seconds',
  labelNames: ['host', 'format'],
  buckets: [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 7, 10],
  registers: [register],
})

const scraperRefreshTotal = new Counter({
  name: 'apollo_daemon_scraper_refresh_total',
  help: 'Total scraper data source refresh attempts',
  labelNames: ['source', 'outcome'],
  registers: [register],
})

const scraperRefreshDuration = new Histogram({
  name: 'apollo_daemon_scraper_refresh_duration_seconds',
  help: 'Scraper data source refresh duration in seconds',
  labelNames: ['source'],
  buckets: [0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 7, 10, 15],
  registers: [register],
})

const scraperLastSuccess = new Gauge({
  name: 'apollo_daemon_scraper_last_success_timestamp_seconds',
  help: 'Unix timestamp of the last successful scraper refresh',
  labelNames: ['source'],
  registers: [register],
})

const recordHttpRequest = (host: string, status: string, format: HttpContentFormat, durationSec: number): void => {
  scraperHttpRequests.inc({ host, status, format })
  scraperHttpDuration.observe({ host, format }, durationSec)
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

export const observeScraperRefresh = async <T>(sourceId: string, fn: () => Promise<T>): Promise<T> => {
  if (!isMetricsEnabled()) {
    return fn()
  }

  const start = Date.now()
  try {
    const result = await fn()
    scraperRefreshTotal.inc({ source: sourceId, outcome: 'success' })
    scraperLastSuccess.set({ source: sourceId }, Date.now() / 1000)
    return result
  } catch (error) {
    scraperRefreshTotal.inc({ source: sourceId, outcome: 'error' })
    throw error
  } finally {
    scraperRefreshDuration.observe({ source: sourceId }, (Date.now() - start) / 1000)
  }
}

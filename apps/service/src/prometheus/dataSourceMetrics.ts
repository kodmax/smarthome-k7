import type { SourceMetricType } from '@repo/apollo-ws'
import { Counter, Gauge, Histogram, register } from 'prom-client'
import { isMetricsEnabled } from './metricsEnabled'

type MetricsBundle = {
  refreshTotal: Counter<'source' | 'outcome'>
  refreshDuration: Histogram<'source'>
  lastSuccess: Gauge<'source'>
}

const knxBuckets = [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25]
const scraperBuckets = [0.5, 0.75, 1, 1.5, 2, 3, 4, 5, 7, 10, 15]
const apiBuckets = [0.1, 0.25, 0.5, 0.75, 1, 1.5, 2, 3, 5, 10]
const dbBuckets = [0.001, 0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1]

const createRefreshMetrics = (category: Exclude<SourceMetricType, 'other'>, buckets: number[]): MetricsBundle => ({
  refreshTotal: new Counter({
    name: `apollo_daemon_${category}_data_source_refresh_total`,
    help: `Total ${category} data source refresh attempts`,
    labelNames: ['source', 'outcome'],
    registers: [register],
  }),
  refreshDuration: new Histogram({
    name: `apollo_daemon_${category}_data_source_refresh_duration_seconds`,
    help: `${category} data source refresh duration in seconds`,
    labelNames: ['source'],
    buckets,
    registers: [register],
  }),
  lastSuccess: new Gauge({
    name: `apollo_daemon_${category}_data_source_last_success_timestamp_seconds`,
    help: `Unix timestamp of the last successful ${category} data source refresh`,
    labelNames: ['source'],
    registers: [register],
  }),
})

const refreshMetricsByType: Record<Exclude<SourceMetricType, 'other'>, MetricsBundle> = {
  knx: createRefreshMetrics('knx', knxBuckets),
  scraper: createRefreshMetrics('scraper', scraperBuckets),
  api: createRefreshMetrics('api', apiBuckets),
  db: createRefreshMetrics('db', dbBuckets),
}

export const observeDataSourceRefresh = async <T>(
  metricType: SourceMetricType,
  sourceId: string,
  fn: () => Promise<T>,
): Promise<T> => {
  if (!isMetricsEnabled() || metricType === 'other') {
    return fn()
  }

  const metrics = refreshMetricsByType[metricType]
  const start = Date.now()

  try {
    const result = await fn()
    metrics.refreshTotal.inc({ source: sourceId, outcome: 'success' })
    metrics.lastSuccess.set({ source: sourceId }, Date.now() / 1000)
    return result
  } catch (error) {
    metrics.refreshTotal.inc({ source: sourceId, outcome: 'error' })
    throw error
  } finally {
    metrics.refreshDuration.observe({ source: sourceId }, (Date.now() - start) / 1000)
  }
}

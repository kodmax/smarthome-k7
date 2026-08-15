import { SpanStatusCode, trace } from '@opentelemetry/api'
import { Counter, Histogram, register } from 'prom-client'
import { isMetricsEnabled } from './metricsEnabled'

export const SLOW_QUERY_THRESHOLD_SEC = 1

export type DbOperation = 'select' | 'insert' | 'update' | 'delete' | 'replace' | 'call' | 'other'

const dbTracer = trace.getTracer('apollo-daemon-db')

const dbQueryDuration = new Histogram({
  name: 'apollo_daemon_db_query_duration_seconds',
  help: 'MariaDB query duration in seconds',
  labelNames: ['operation', 'table'],
  buckets: [0.0005, 0.001, 0.002, 0.003, 0.005, 0.0075, 0.01, 0.02, 0.05, 0.1, 0.25],
  registers: [register],
})

const dbQueriesTotal = new Counter({
  name: 'apollo_daemon_db_queries_total',
  help: 'Total MariaDB queries',
  labelNames: ['operation', 'table', 'outcome'],
  registers: [register],
})

const dbSlowQueriesTotal = new Counter({
  name: 'apollo_daemon_db_slow_queries_total',
  help: 'MariaDB queries slower than the configured threshold',
  labelNames: ['operation', 'table'],
  registers: [register],
})

const recordDbQuery = (operation: DbOperation, table: string, durationSec: number, error?: Error): void => {
  const outcome = error === undefined ? 'success' : 'error'

  dbQueriesTotal.inc({ operation, table, outcome })
  dbQueryDuration.observe({ operation, table }, durationSec)

  if (durationSec >= SLOW_QUERY_THRESHOLD_SEC) {
    dbSlowQueriesTotal.inc({ operation, table })
  }
}

export const observeDbQuery = async <T>(operation: DbOperation, table: string, fn: () => Promise<T>): Promise<T> => {
  return dbTracer.startActiveSpan(
    'db.query',
    {
      attributes: {
        'db.system': 'postgresql',
        'db.operation': operation,
        'db.sql.table': table,
      },
    },
    async span => {
      const metricsEnabled = isMetricsEnabled()
      const start = metricsEnabled ? Date.now() : 0

      try {
        const result = await fn()
        if (metricsEnabled) {
          recordDbQuery(operation, table, (Date.now() - start) / 1000)
        }
        return result
      } catch (error) {
        if (metricsEnabled) {
          recordDbQuery(
            operation,
            table,
            (Date.now() - start) / 1000,
            error instanceof Error ? error : new Error(String(error)),
          )
        }
        span.recordException(error instanceof Error ? error : new Error(String(error)))
        span.setStatus({ code: SpanStatusCode.ERROR })
        throw error
      } finally {
        span.end()
      }
    },
  )
}

import { createServer, type Server as HttpServer } from 'node:http'
import { collectDefaultMetrics, register } from 'prom-client'
import type { Logger } from '@repo/logger'
import { collectOtelPrometheusMetrics } from '../otel-instrumentation'
const DEFAULT_PORT = 9464

let metricsServer: HttpServer | undefined

export function initPrometheus(logger: Logger): void {
  if (process.env.NO_METRICS === '1') {
    logger.info('Prometheus metrics disabled (NO_METRICS=1)')
    return
  }

  const port = Number(process.env.METRICS_PORT ?? DEFAULT_PORT)
  if (Number.isNaN(port)) {
    throw new Error('Environment variable METRICS_PORT must be a number')
  }

  collectDefaultMetrics({ register, prefix: 'apollo_daemon_' })

  metricsServer = createServer(async (req, res) => {
    if (req.url !== '/metrics' || req.method !== 'GET') {
      res.writeHead(404)
      res.end()
      return
    }

    const [promMetrics, otelCollection] = await Promise.all([register.metrics(), collectOtelPrometheusMetrics()])

    if (otelCollection.errors.length > 0) {
      logger.warn({ errors: otelCollection.errors }, 'OpenTelemetry metrics collection errors')
    }

    const body = otelCollection.metrics.length > 0 ? `${promMetrics}\n${otelCollection.metrics}` : promMetrics

    res.setHeader('Content-Type', register.contentType)
    res.end(body)
  })

  metricsServer.listen(port, () => {
    logger.info({ port }, 'Prometheus metrics server listening')
  })

  metricsServer.on('error', err => {
    logger.error({ err, port }, 'Prometheus metrics server error')
  })
}

export async function closePrometheus(): Promise<void> {
  if (metricsServer === undefined) {
    return
  }

  const server = metricsServer
  metricsServer = undefined

  await new Promise<void>((resolve, reject) => {
    server.close(err => {
      if (err !== undefined && 'code' in err && err.code === 'ERR_SERVER_NOT_RUNNING') {
        resolve()
        return
      }

      err ? reject(err) : resolve()
    })
  })
}

import './load-env'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { PrometheusExporter, PrometheusSerializer } from '@opentelemetry/exporter-prometheus'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { rootLogger } from '@repo/logger'

const serviceName = process.env.OTEL_SERVICE_NAME ?? 'apollo-daemon'

const logger = rootLogger.child({ name: 'otel-instrumentation' })

export const otelPrometheusExporter = new PrometheusExporter({
  preventServerStart: true,
})

const otelPrometheusSerializer = new PrometheusSerializer()

const sdk = new NodeSDK({
  serviceName,
  metricReaders: [otelPrometheusExporter],
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
      '@opentelemetry/instrumentation-net': { enabled: false },
    }),
  ],
})

export const collectOtelPrometheusMetrics = async (): Promise<string> => {
  const { resourceMetrics, errors } = await otelPrometheusExporter.collect()

  if (errors.length > 0) {
    logger.warn({ errors }, 'OpenTelemetry metrics collection errors')
  }

  return otelPrometheusSerializer.serialize(resourceMetrics)
}

sdk.start()
logger.info({ serviceName }, 'OpenTelemetry SDK started')

let shuttingDown = false

export const closeOpenTelemetry = async (): Promise<void> => {
  if (shuttingDown) {
    return
  }
  shuttingDown = true

  try {
    await sdk.shutdown()
    logger.info({ step: 'open-telemetry' }, 'Shutdown step complete')
  } catch (error) {
    logger.error({ error }, 'Failed to shut down OpenTelemetry SDK')
  }
}

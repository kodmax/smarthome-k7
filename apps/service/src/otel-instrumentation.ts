// Loaded via preload.ts (load-env → Sentry → OTEL).
import { W3CTraceContextPropagator } from '@opentelemetry/core'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { PrometheusExporter, PrometheusSerializer } from '@opentelemetry/exporter-prometheus'
import { PinoInstrumentation } from '@opentelemetry/instrumentation-pino'
import { NodeSDK } from '@opentelemetry/sdk-node'

const serviceName = process.env.OTEL_SERVICE_NAME ?? 'apollo-daemon'
const otelSdkDisabled = process.env.OTEL_SDK_DISABLED?.trim().toLowerCase()
const sdkEnabled = otelSdkDisabled !== 'true' && otelSdkDisabled !== '1'

export const otelPrometheusExporter = new PrometheusExporter({
  preventServerStart: true,
})

const otelPrometheusSerializer = new PrometheusSerializer()

const sdk = new NodeSDK({
  serviceName,
  metricReaders: [otelPrometheusExporter],
  textMapPropagator: new W3CTraceContextPropagator(),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
      '@opentelemetry/instrumentation-net': { enabled: false },
    }),
    new PinoInstrumentation({
      disableLogSending: true,
      logKeys: {
        traceId: 'trace_id',
        spanId: 'span_id',
        traceFlags: 'trace_flags',
      },
    }),
  ],
})

export type OtelPrometheusMetricsCollection = {
  metrics: string
  errors: unknown[]
}

export const collectOtelPrometheusMetrics = async (): Promise<OtelPrometheusMetricsCollection> => {
  if (!sdkEnabled) {
    return { metrics: '', errors: [] }
  }

  const { resourceMetrics, errors } = await otelPrometheusExporter.collect()

  return {
    metrics: otelPrometheusSerializer.serialize(resourceMetrics),
    errors,
  }
}

if (sdkEnabled) {
  sdk.start()
}

export function isOpenTelemetryStarted(): boolean {
  return sdkEnabled
}

export function getOpenTelemetryServiceName(): string {
  return serviceName
}

let shuttingDown = false

export const closeOpenTelemetry = async (): Promise<void> => {
  if (shuttingDown || !sdkEnabled) {
    return
  }
  shuttingDown = true

  await sdk.shutdown()
}

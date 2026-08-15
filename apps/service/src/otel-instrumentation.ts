import './load-env'
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node'
import { NodeSDK } from '@opentelemetry/sdk-node'
import { rootLogger } from '@repo/logger'

const serviceName = process.env.OTEL_SERVICE_NAME ?? 'apollo-daemon'

const logger = rootLogger.child({ name: 'otel-instrumentation' })

const sdk = new NodeSDK({
  serviceName,
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-fs': { enabled: false },
      '@opentelemetry/instrumentation-dns': { enabled: false },
      '@opentelemetry/instrumentation-net': { enabled: false },
    }),
  ],
})

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

import { NodeSDK } from '@opentelemetry/sdk-node'
import { rootLogger } from '@repo/logger'

const SERVICE_NAME = 'apollo-daemon'

const logger = rootLogger.child({ name: 'otel-instrumentation' })

const sdk = new NodeSDK({
  serviceName: SERVICE_NAME,
})

sdk.start()
logger.info({ serviceName: SERVICE_NAME }, 'OpenTelemetry SDK started')

let shuttingDown = false
const shutdown = async (): Promise<void> => {
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

process.once('SIGTERM', () => void shutdown())
process.once('SIGINT', () => void shutdown())

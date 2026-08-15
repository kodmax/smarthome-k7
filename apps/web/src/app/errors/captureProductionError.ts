import { isProduction } from '@repo/env'
import { captureSentryException } from '@/telemetry/enrichSentryWithTraceContext'

export function captureProductionError(error: unknown): void {
  if (!isProduction) {
    return
  }

  captureSentryException(error)
}

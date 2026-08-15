import { isProduction } from '@repo/env'
import { incKnxReadTimeout } from '@/prometheus/knxMetrics'
import { captureSentryException } from '@/telemetry/enrichSentryWithTraceContext'
import { isKnxReadTimeout, shouldCaptureKnxError } from './knxError'

export function captureProductionError(error: unknown): void {
  if (!isProduction) {
    return
  }

  if (isKnxReadTimeout(error)) {
    incKnxReadTimeout(error.details.address ?? 'unknown')

    if (!shouldCaptureKnxError(error)) {
      return
    }
  }

  captureSentryException(error)
}

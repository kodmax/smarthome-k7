import * as Sentry from '@sentry/react'
import { isProduction } from '@/env'

export function captureProductionError(error: unknown): void {
  if (!isProduction) {
    return
  }

  Sentry.captureException(error)
}

import * as Sentry from '@sentry/node'
import { isProduction } from '@repo/env'

export function captureProductionError(error: unknown): void {
  if (!isProduction) {
    return
  }

  Sentry.captureException(error)
}

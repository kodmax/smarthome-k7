import * as Sentry from '@sentry/node'
import { isProduction } from '../env'

export function captureInvalidInput(context: string, cause?: unknown): void {
  if (!isProduction) {
    return
  }

  const error = cause !== undefined ? new Error(context, { cause }) : new Error(context)

  Sentry.captureException(error)
}

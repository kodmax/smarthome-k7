import * as Sentry from '@sentry/react'
import { isProduction } from '@/env'

export function isSentryEnabled(): boolean {
  return isProduction && Boolean(import.meta.env.VITE_SENTRY_DSN)
}

export function sendSentryTestEvent(): boolean {
  if (!isSentryEnabled()) {
    return false
  }

  Sentry.captureException(new Error('Sentry test error (appearance settings)'))
  return true
}

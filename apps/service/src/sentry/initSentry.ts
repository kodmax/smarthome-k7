import * as Sentry from '@sentry/node'
import { appMode, isDevelopment } from '@repo/env'

const dsn = process.env.SENTRY_DSN
const sentryEnabled = !isDevelopment && dsn !== undefined && dsn.length > 0

if (sentryEnabled) {
  Sentry.init({
    dsn,
    environment: appMode,
    release: process.env.SENTRY_RELEASE,
    skipOpenTelemetrySetup: true,
  })
}

export function isSentryEnabled(): boolean {
  return sentryEnabled
}

export async function closeSentry(timeoutMs = 2000): Promise<void> {
  if (!sentryEnabled) {
    return
  }

  await Sentry.close(timeoutMs)
}

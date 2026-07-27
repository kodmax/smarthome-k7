import * as Sentry from '@sentry/node'
import { createLogger } from '@repo/logger'
import { appMode, isDevelopment } from '@repo/env'

const logger = createLogger({ name: 'sentry' })

export function initSentry(): void {
  if (isDevelopment) {
    return
  }

  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    logger.info({ appMode }, 'Sentry disabled (missing SENTRY_DSN)')
    return
  }

  Sentry.init({
    dsn,
    environment: appMode,
    release: process.env.SENTRY_RELEASE,
    tracesSampleRate: 0.2,
  })
}

export async function closeSentry(timeoutMs = 2000): Promise<void> {
  if (isDevelopment || !process.env.SENTRY_DSN) {
    return
  }

  await Sentry.close(timeoutMs)
}

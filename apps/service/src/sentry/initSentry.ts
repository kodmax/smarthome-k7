import * as Sentry from '@sentry/node'
import { appMode, isDevelopment } from '../env'

export function initSentry(): void {
  if (isDevelopment) {
    return
  }

  const dsn = process.env.SENTRY_DSN
  if (!dsn) {
    console.info(`[sentry] disabled (${appMode}, missing SENTRY_DSN)`)
    return
  }

  Sentry.init({
    dsn,
    environment: appMode,
    tracesSampleRate: 0.2,
  })

  console.info(`[sentry] enabled (${appMode})`)
}

export async function closeSentry(timeoutMs = 2000): Promise<void> {
  if (isDevelopment || !process.env.SENTRY_DSN) {
    return
  }

  await Sentry.close(timeoutMs)
}

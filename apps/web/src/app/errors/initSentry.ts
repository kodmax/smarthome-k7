import * as Sentry from '@sentry/react'
import { useEffect } from 'react'
import { createRoutesFromChildren, matchRoutes, useLocation, useNavigationType } from 'react-router-dom'
import { isDevelopment } from '@repo/env'

export function initSentry(): void {
  if (isDevelopment) {
    return
  }

  const mode = import.meta.env.MODE
  const dsn = import.meta.env.VITE_SENTRY_DSN
  if (!dsn) {
    console.info(`[sentry] disabled (${mode}, missing VITE_SENTRY_DSN)`)
    return
  }

  Sentry.init({
    dsn,
    environment: mode,
    release: import.meta.env.VITE_SENTRY_RELEASE,
    integrations: [
      Sentry.reactRouterBrowserTracingIntegration({
        useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
    ],
    tracesSampleRate: 0.2,
  })
}

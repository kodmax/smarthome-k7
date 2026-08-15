import type { Scope } from '@sentry/node'
import * as Sentry from '@sentry/node'
import { trace } from '@opentelemetry/api'

export function applyActiveTraceTags(scope: Scope): void {
  const ctx = trace.getActiveSpan()?.spanContext()
  if (ctx?.traceId === undefined || ctx.traceId.length === 0) {
    scope.setTag('trace_id', undefined)
    scope.setTag('span_id', undefined)
    return
  }

  scope.setTag('trace_id', ctx.traceId)
  scope.setTag('span_id', ctx.spanId)
}

export function captureSentryException(error: unknown): void {
  Sentry.withScope(scope => {
    applyActiveTraceTags(scope)
    Sentry.captureException(error)
  })
}

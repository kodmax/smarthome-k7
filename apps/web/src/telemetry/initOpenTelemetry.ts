import { W3CTraceContextPropagator } from '@opentelemetry/core'
import { registerInstrumentations } from '@opentelemetry/instrumentation'
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch'
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web'
import { ZoneContextManager } from '@opentelemetry/context-zone'
import { isProduction } from '@repo/env'
import { buildTracePropagationUrls } from './buildTracePropagationUrls'

export function initOpenTelemetry(): void {
  if (!isProduction) {
    return
  }

  const provider = new WebTracerProvider()
  provider.register({
    contextManager: new ZoneContextManager(),
    propagator: new W3CTraceContextPropagator(),
  })

  registerInstrumentations({
    instrumentations: [
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: buildTracePropagationUrls(),
        ignoreUrls: [/\.(?:png|jpg|svg|woff2?|ico)(?:\?|$)/i],
      }),
    ],
  })
}

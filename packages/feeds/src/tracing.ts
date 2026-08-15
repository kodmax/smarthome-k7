import { SpanStatusCode, trace, type Span } from '@opentelemetry/api'

const tracer = trace.getTracer('apollo-feeds')

type SpanAttributes = Record<string, string | number | boolean>

const recordSpanError = (span: Span, error: unknown): void => {
  span.recordException(error instanceof Error ? error : new Error(String(error)))
  span.setStatus({ code: SpanStatusCode.ERROR })
}

export const setActiveSpanAttributes = (attributes: SpanAttributes): void => {
  trace.getActiveSpan()?.setAttributes(attributes)
}

export const withSpan = async <T>(
  name: string,
  attributes: SpanAttributes,
  fn: (span: Span) => Promise<T>,
): Promise<T> => {
  return tracer.startActiveSpan(name, { attributes }, async span => {
    try {
      return await fn(span)
    } catch (error) {
      recordSpanError(span, error)
      throw error
    } finally {
      span.end()
    }
  })
}

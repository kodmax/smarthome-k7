import { afterEach, describe, expect, it, vi } from 'vitest'

const scope = vi.hoisted(() => ({
  setTag: vi.fn(),
}))

const { withScope, captureException } = vi.hoisted(() => ({
  withScope: vi.fn((callback: (scope: typeof scope) => void) => {
    callback(scope)
  }),
  captureException: vi.fn(),
}))

const { getActiveSpan } = vi.hoisted(() => ({
  getActiveSpan: vi.fn(),
}))

vi.mock('@sentry/node', () => ({
  withScope,
  captureException,
}))

vi.mock('@opentelemetry/api', () => ({
  trace: {
    getActiveSpan,
  },
}))

import { applyActiveTraceTags, captureSentryException } from './enrichSentryWithTraceContext'

describe('applyActiveTraceTags', () => {
  afterEach(() => {
    scope.setTag.mockClear()
    getActiveSpan.mockReset()
  })

  it('sets trace_id and span_id when active span exists', () => {
    getActiveSpan.mockReturnValue({
      spanContext: () => ({
        traceId: 'abc123',
        spanId: 'def456',
      }),
    })

    applyActiveTraceTags(scope as never)

    expect(scope.setTag).toHaveBeenCalledWith('trace_id', 'abc123')
    expect(scope.setTag).toHaveBeenCalledWith('span_id', 'def456')
  })

  it('clears tags when there is no active span', () => {
    getActiveSpan.mockReturnValue(undefined)

    applyActiveTraceTags(scope as never)

    expect(scope.setTag).toHaveBeenCalledWith('trace_id', undefined)
    expect(scope.setTag).toHaveBeenCalledWith('span_id', undefined)
  })

  it('clears tags when traceId is empty', () => {
    getActiveSpan.mockReturnValue({
      spanContext: () => ({
        traceId: '',
        spanId: 'def456',
      }),
    })

    applyActiveTraceTags(scope as never)

    expect(scope.setTag).toHaveBeenCalledWith('trace_id', undefined)
    expect(scope.setTag).toHaveBeenCalledWith('span_id', undefined)
  })
})

describe('captureSentryException', () => {
  afterEach(() => {
    withScope.mockClear()
    captureException.mockClear()
    scope.setTag.mockClear()
    getActiveSpan.mockReset()
  })

  it('captures inside an isolated scope', () => {
    const error = new Error('boom')
    getActiveSpan.mockReturnValue({
      spanContext: () => ({
        traceId: 'abc123',
        spanId: 'def456',
      }),
    })

    captureSentryException(error)

    expect(withScope).toHaveBeenCalledTimes(1)
    expect(scope.setTag).toHaveBeenCalledWith('trace_id', 'abc123')
    expect(captureException).toHaveBeenCalledWith(error)
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'
import { KnxLinkException } from 'js-knx'

const { captureSentryException } = vi.hoisted(() => ({
  captureSentryException: vi.fn(),
}))

const { incKnxReadTimeout } = vi.hoisted(() => ({
  incKnxReadTimeout: vi.fn(),
}))

vi.mock('@repo/env', () => ({
  isProduction: true,
}))

vi.mock('@/telemetry/enrichSentryWithTraceContext', () => ({
  captureSentryException,
}))

vi.mock('@/prometheus/knxMetrics', () => ({
  incKnxReadTimeout,
}))

import { captureProductionError } from './captureProductionError'

const readTimeout = (consecutiveReadTimeouts: number): KnxLinkException =>
  new KnxLinkException('READ_TIMEOUT', 'Timeout waiting for 5/2/2 response', {
    address: '5/2/2',
    readTimeoutCount: consecutiveReadTimeouts,
    consecutiveReadTimeouts,
  })

describe('captureProductionError', () => {
  afterEach(() => {
    captureSentryException.mockClear()
    incKnxReadTimeout.mockClear()
  })

  it('does not report isolated KNX read timeouts to Sentry but increments metric', () => {
    captureProductionError(readTimeout(1))

    expect(incKnxReadTimeout).toHaveBeenCalledWith('5/2/2')
    expect(captureSentryException).not.toHaveBeenCalled()
  })

  it('does not report KNX read timeouts below threshold to Sentry', () => {
    captureProductionError(readTimeout(4))

    expect(incKnxReadTimeout).toHaveBeenCalledWith('5/2/2')
    expect(captureSentryException).not.toHaveBeenCalled()
  })

  it('reports KNX read timeouts at threshold to Sentry', () => {
    const error = readTimeout(5)

    captureProductionError(error)

    expect(incKnxReadTimeout).toHaveBeenCalledWith('5/2/2')
    expect(captureSentryException).toHaveBeenCalledTimes(1)
    expect(captureSentryException).toHaveBeenCalledWith(error)
  })

  it('reports non-KNX errors to Sentry without metric', () => {
    const error = new Error('unexpected')

    captureProductionError(error)

    expect(incKnxReadTimeout).not.toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(error)
  })

  it('reports other KnxLinkException codes to Sentry without metric', () => {
    const error = new KnxLinkException('CONNECTION_TIMEOUT', 'Knx IP Gateway connection timeout', {})

    captureProductionError(error)

    expect(incKnxReadTimeout).not.toHaveBeenCalled()
    expect(captureSentryException).toHaveBeenCalledWith(error)
  })
})

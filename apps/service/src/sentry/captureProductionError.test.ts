import { afterEach, describe, expect, it, vi } from 'vitest'
import { KnxLinkException } from 'js-knx'

const { captureException } = vi.hoisted(() => ({
  captureException: vi.fn(),
}))

const { incKnxReadTimeout } = vi.hoisted(() => ({
  incKnxReadTimeout: vi.fn(),
}))

vi.mock('@sentry/node', () => ({
  captureException,
}))

vi.mock('@repo/env', () => ({
  isProduction: true,
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
    captureException.mockClear()
    incKnxReadTimeout.mockClear()
  })

  it('does not report isolated KNX read timeouts to Sentry but increments metric', () => {
    captureProductionError(readTimeout(1))

    expect(incKnxReadTimeout).toHaveBeenCalledWith('5/2/2')
    expect(captureException).not.toHaveBeenCalled()
  })

  it('does not report KNX read timeouts below threshold to Sentry', () => {
    captureProductionError(readTimeout(4))

    expect(incKnxReadTimeout).toHaveBeenCalledWith('5/2/2')
    expect(captureException).not.toHaveBeenCalled()
  })

  it('reports KNX read timeouts at threshold to Sentry', () => {
    const error = readTimeout(5)

    captureProductionError(error)

    expect(incKnxReadTimeout).toHaveBeenCalledWith('5/2/2')
    expect(captureException).toHaveBeenCalledTimes(1)
    expect(captureException).toHaveBeenCalledWith(error)
  })

  it('reports non-KNX errors to Sentry without metric', () => {
    const error = new Error('unexpected')

    captureProductionError(error)

    expect(incKnxReadTimeout).not.toHaveBeenCalled()
    expect(captureException).toHaveBeenCalledWith(error)
  })

  it('reports other KnxLinkException codes to Sentry without metric', () => {
    const error = new KnxLinkException('CONNECTION_TIMEOUT', 'Knx IP Gateway connection timeout', {})

    captureProductionError(error)

    expect(incKnxReadTimeout).not.toHaveBeenCalled()
    expect(captureException).toHaveBeenCalledWith(error)
  })
})

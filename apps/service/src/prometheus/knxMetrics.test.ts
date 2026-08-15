import { afterEach, describe, expect, it, vi } from 'vitest'
import { register } from 'prom-client'

vi.mock('./metricsEnabled', () => ({
  isMetricsEnabled: vi.fn(() => true),
}))

import { isMetricsEnabled } from './metricsEnabled'
import { incKnxReadTimeout } from './knxMetrics'

describe('incKnxReadTimeout', () => {
  afterEach(async () => {
    register.resetMetrics()
    vi.mocked(isMetricsEnabled).mockReturnValue(true)
  })

  it('increments counter with group address label', async () => {
    incKnxReadTimeout('5/2/2')
    incKnxReadTimeout('5/2/2')
    incKnxReadTimeout('2/3/3')

    const metrics = await register.metrics()

    expect(metrics).toContain('apollo_daemon_knx_read_timeout_total{group_address="5/2/2"} 2')
    expect(metrics).toContain('apollo_daemon_knx_read_timeout_total{group_address="2/3/3"} 1')
  })

  it('does nothing when metrics are disabled', async () => {
    vi.mocked(isMetricsEnabled).mockReturnValue(false)

    incKnxReadTimeout('5/2/2')

    const metrics = await register.metrics()

    expect(metrics).not.toMatch(/apollo_daemon_knx_read_timeout_total\{group_address="5\/2\/2"\} [1-9]/)
  })
})

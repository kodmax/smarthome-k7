import { FeedEvents } from '@repo/feeds'
import { describe, expect, it, vi } from 'vitest'
import { register } from 'prom-client'
import { registerWsMetrics } from './wsMetrics'

describe('registerWsMetrics', () => {
  it('updates client gauge', async () => {
    const vent = new FeedEvents()
    registerWsMetrics(vent)

    vent.emit('clients-changed', 2)

    const metrics = await register.metrics()
    expect(metrics).toContain('apollo_daemon_ws_clients_connected 2')
  })

  it('is a no-op when NO_METRICS=1', () => {
    vi.stubEnv('NO_METRICS', '1')
    const vent = new FeedEvents()

    expect(() => registerWsMetrics(vent)).not.toThrow()
    vent.emit('clients-changed', 3)

    vi.unstubAllEnvs()
  })
})

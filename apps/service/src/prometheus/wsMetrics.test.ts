import { FeedEvents } from '@repo/feeds'
import { describe, expect, it, vi } from 'vitest'
import { register } from 'prom-client'
import { registerWsMetrics } from './wsMetrics'

describe('registerWsMetrics', () => {
  it('updates client gauge and command counter', async () => {
    const vent = new FeedEvents()
    registerWsMetrics(vent)

    vent.emit('clients-changed', 2)
    vent.emit('command', { sourceId: 'job-ads', name: 'fav', args: '123' })

    const metrics = await register.metrics()
    expect(metrics).toContain('apollo_daemon_ws_clients_connected 2')
    expect(metrics).toContain('apollo_daemon_ws_commands_total{source="job-ads",command="fav"} 1')
  })

  it('is a no-op when NO_METRICS=1', () => {
    vi.stubEnv('NO_METRICS', '1')
    const vent = new FeedEvents()

    expect(() => registerWsMetrics(vent)).not.toThrow()
    vent.emit('clients-changed', 3)
    vent.emit('command', { sourceId: 'news', name: 'read', args: '1' })

    vi.unstubAllEnvs()
  })
})

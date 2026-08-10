import { describe, expect, it, vi } from 'vitest'
import { register } from 'prom-client'
import { incApiCommand, parseCommandRequestPath } from './commandMetrics'

describe('parseCommandRequestPath', () => {
  it('parses command routes', () => {
    expect(parseCommandRequestPath('/data-sources/job-ads/command/fav')).toEqual({
      source: 'job-ads',
      command: 'fav',
    })
  })

  it('ignores non-command routes', () => {
    expect(parseCommandRequestPath('/feeds/cv')).toBeUndefined()
  })
})

describe('incApiCommand', () => {
  it('increments command counter', async () => {
    incApiCommand('job-ads', 'fav', 'success')

    const metrics = await register.metrics()
    expect(metrics).toContain('apollo_daemon_api_commands_total{source="job-ads",command="fav",outcome="success"} 1')
  })

  it('is a no-op when NO_METRICS=1', () => {
    vi.stubEnv('NO_METRICS', '1')

    expect(() => incApiCommand('news', 'read', 'error')).not.toThrow()

    vi.unstubAllEnvs()
  })
})

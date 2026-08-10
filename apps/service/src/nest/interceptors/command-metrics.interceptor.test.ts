import { CallHandler, ExecutionContext } from '@nestjs/common'
import { lastValueFrom, of, throwError } from 'rxjs'
import { describe, expect, it, vi } from 'vitest'
import { register } from 'prom-client'
import { CommandMetricsInterceptor } from './command-metrics.interceptor'

const createContext = (path: string): ExecutionContext =>
  ({
    getType: () => 'http',
    switchToHttp: () => ({
      getRequest: () => ({ path }),
    }),
  }) as ExecutionContext

describe('CommandMetricsInterceptor', () => {
  it('records success for command routes', async () => {
    const interceptor = new CommandMetricsInterceptor()
    const next: CallHandler = { handle: () => of(undefined) }

    await lastValueFrom(interceptor.intercept(createContext('/data-sources/lights/command/set'), next))

    const metrics = await register.metrics()
    expect(metrics).toContain('apollo_daemon_api_commands_total{source="lights",command="set",outcome="success"} 1')
  })

  it('records error outcome when handler throws', async () => {
    const interceptor = new CommandMetricsInterceptor()
    const next: CallHandler = {
      handle: () => throwError(() => new Error('command failed')),
    }

    await expect(
      lastValueFrom(interceptor.intercept(createContext('/data-sources/cv/command/upload'), next)),
    ).rejects.toThrow('command failed')

    const metrics = await register.metrics()
    expect(metrics).toContain('apollo_daemon_api_commands_total{source="cv",command="upload",outcome="error"} 1')
  })

  it('ignores non-command routes', async () => {
    const incSpy = vi.spyOn(await import('@/prometheus/commandMetrics'), 'incApiCommand')
    const interceptor = new CommandMetricsInterceptor()
    const next: CallHandler = { handle: () => of(undefined) }

    await lastValueFrom(interceptor.intercept(createContext('/feeds/cv'), next))

    expect(incSpy).not.toHaveBeenCalled()
    incSpy.mockRestore()
  })
})

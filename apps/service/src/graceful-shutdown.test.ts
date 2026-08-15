import { afterEach, describe, expect, it, vi } from 'vitest'

const exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => undefined) as never)

vi.mock('@repo/db', () => ({
  closeSql: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('./redis', () => ({
  closeRedisClient: vi.fn().mockResolvedValue(false),
}))

vi.mock('./prometheus', () => ({
  closePrometheus: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('./otel-instrumentation', () => ({
  closeOpenTelemetry: vi.fn().mockResolvedValue(undefined),
}))

vi.mock('./sentry', () => ({
  captureProductionError: vi.fn(),
  closeSentry: vi.fn().mockResolvedValue(undefined),
}))

const loadGracefulShutdown = async () => {
  vi.resetModules()
  return import('./graceful-shutdown')
}

describe('graceful-shutdown', () => {
  afterEach(() => {
    process.removeAllListeners('SIGTERM')
    process.removeAllListeners('SIGINT')
    exitSpy.mockClear()
  })

  it('isShuttingDown is false before shutdown', async () => {
    const { isShuttingDown } = await loadGracefulShutdown()

    expect(isShuttingDown()).toBe(false)
  })

  it('isShuttingDown becomes true after SIGTERM', async () => {
    const { isShuttingDown, setupGracefulShutdown } = await loadGracefulShutdown()
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }

    setupGracefulShutdown(logger as never)
    process.emit('SIGTERM')

    expect(isShuttingDown()).toBe(true)
  })

  it('StartupAbortedError identifies startup abort', async () => {
    const { StartupAbortedError } = await loadGracefulShutdown()

    expect(new StartupAbortedError()).toMatchObject({
      name: 'StartupAbortedError',
      message: 'Startup aborted during shutdown',
    })
  })

  it('aborts in-flight KNX connect on SIGTERM', async () => {
    const { registerKnxConnectAttempt, setupGracefulShutdown } = await loadGracefulShutdown()
    const logger = { info: vi.fn(), warn: vi.fn(), error: vi.fn() }
    const abortConnect = vi.fn()

    registerKnxConnectAttempt({ abortConnect } as never)
    setupGracefulShutdown(logger as never)
    process.emit('SIGTERM')

    await vi.waitFor(() => {
      expect(abortConnect).toHaveBeenCalledOnce()
    })

    expect(logger.info).toHaveBeenCalledWith({ step: 'knx-connect' }, 'KNX connect aborted')
  })
})

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

const createLogger = () => ({
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
  flush: vi.fn((callback: () => void) => callback()),
})

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
    const logger = createLogger()

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
    const logger = createLogger()
    const abortConnect = vi.fn()

    registerKnxConnectAttempt({ abortConnect } as never)
    setupGracefulShutdown(logger as never)
    process.emit('SIGTERM')

    await vi.waitFor(() => {
      expect(abortConnect).toHaveBeenCalledOnce()
    })

    expect(logger.info).toHaveBeenCalledWith({ step: 'knx-connect' }, 'KNX connect aborted')
  })

  it('flushes logs before exiting on successful shutdown', async () => {
    const { setupGracefulShutdown } = await loadGracefulShutdown()
    const logger = createLogger()

    setupGracefulShutdown(logger as never)
    process.emit('SIGTERM')

    await vi.waitFor(() => {
      expect(logger.flush).toHaveBeenCalledOnce()
      expect(exitSpy).toHaveBeenCalledWith(0)
    })
  })

  it('ignores duplicate SIGINT while shutdown is in progress', async () => {
    const { isShuttingDown, setupGracefulShutdown } = await loadGracefulShutdown()
    const logger = createLogger()

    setupGracefulShutdown(logger as never)
    process.emit('SIGINT')

    expect(isShuttingDown()).toBe(true)

    process.emit('SIGINT')

    expect(logger.warn).toHaveBeenCalledWith(
      { signal: 'SIGINT' },
      'Duplicate shutdown signal ignored (turbo/node --watch may deliver SIGINT twice per Ctrl+C)',
    )
    expect(exitSpy).toHaveBeenCalledTimes(0)
  })

  it('terminates node --watch parent on exit when WATCH_PARENT_EXIT=1', async () => {
    const killSpy = vi.spyOn(process, 'kill').mockImplementation((() => true) as never)
    vi.stubEnv('WATCH_PARENT_EXIT', '1')
    const ppidDescriptor = Object.getOwnPropertyDescriptor(process, 'ppid')
    Object.defineProperty(process, 'ppid', { configurable: true, value: 4242 })

    const { setupGracefulShutdown } = await loadGracefulShutdown()
    const logger = createLogger()

    setupGracefulShutdown(logger as never)
    process.emit('SIGTERM')

    await vi.waitFor(() => {
      expect(killSpy).toHaveBeenCalledWith(4242, 'SIGTERM')
      expect(exitSpy).toHaveBeenCalledWith(0)
    })

    if (ppidDescriptor) {
      Object.defineProperty(process, 'ppid', ppidDescriptor)
    }
    killSpy.mockRestore()
    vi.unstubAllEnvs()
  })
})

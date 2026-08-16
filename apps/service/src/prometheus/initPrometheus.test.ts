import { beforeEach, describe, expect, it, vi } from 'vitest'

const mockClose = vi.fn()
const mockListen = vi.fn()
const mockOn = vi.fn()

vi.mock('node:http', () => ({
  createServer: vi.fn(() => ({
    close: mockClose,
    listen: mockListen,
    on: mockOn,
  })),
}))

vi.mock('prom-client', () => ({
  collectDefaultMetrics: vi.fn(),
  register: {
    metrics: vi.fn().mockResolvedValue(''),
    contentType: 'text/plain',
  },
}))

vi.mock('../otel-instrumentation', () => ({
  collectOtelPrometheusMetrics: vi.fn().mockResolvedValue({ metrics: '', errors: [] }),
}))

const silentLogger = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
}

describe('closePrometheus', () => {
  beforeEach(() => {
    vi.resetModules()
    mockClose.mockReset()
    mockListen.mockReset()
    mockOn.mockReset()
  })

  it('treats ERR_SERVER_NOT_RUNNING as success', async () => {
    mockClose.mockImplementation(callback => {
      callback({ code: 'ERR_SERVER_NOT_RUNNING' })
    })

    const { initPrometheus, closePrometheus } = await import('./initPrometheus')
    initPrometheus(silentLogger as never)

    await expect(closePrometheus()).resolves.toBeUndefined()
  })

  it('rejects other close errors', async () => {
    const closeError = Object.assign(new Error('close failed'), { code: 'EADDRINUSE' })
    mockClose.mockImplementation(callback => {
      callback(closeError)
    })

    const { initPrometheus, closePrometheus } = await import('./initPrometheus')
    initPrometheus(silentLogger as never)

    await expect(closePrometheus()).rejects.toThrow('close failed')
  })
})

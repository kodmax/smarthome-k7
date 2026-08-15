import { afterEach, describe, expect, it, vi } from 'vitest'

const { isShuttingDown, registerKnxLink, registerKnxConnectAttempt, clearKnxConnectAttempt } = vi.hoisted(() => ({
  isShuttingDown: vi.fn(),
  registerKnxLink: vi.fn(),
  registerKnxConnectAttempt: vi.fn(),
  clearKnxConnectAttempt: vi.fn(),
}))

const connect = vi.fn()
const disconnect = vi.fn()
const on = vi.fn()
const abortConnect = vi.fn()

vi.mock('./graceful-shutdown', async importOriginal => {
  const actual = await importOriginal<typeof import('./graceful-shutdown')>()

  return {
    ...actual,
    isShuttingDown,
    registerKnxLink,
    registerKnxConnectAttempt,
    clearKnxConnectAttempt,
  }
})

vi.mock('./sentry', () => ({
  captureProductionError: vi.fn(),
}))

vi.mock('./config', () => ({
  config: {
    knx: {
      host: '192.168.1.8',
    },
  },
}))

vi.mock('js-knx', () => ({
  KnxLink: vi.fn(function KnxLinkMock() {
    return {
      connect,
      disconnect,
      on,
      abortConnect,
    }
  }),
  KnxLinkException: class KnxLinkException extends Error {
    constructor(
      public code: string,
      message: string,
    ) {
      super(message)
      this.name = 'KnxLinkException'
    }
  },
}))

import { knxInit } from './knx-init'
import { StartupAbortedError } from './graceful-shutdown'
import { KnxLinkException } from 'js-knx'

describe('knxInit', () => {
  const logger = {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  }

  afterEach(() => {
    connect.mockReset()
    disconnect.mockReset()
    on.mockReset()
    abortConnect.mockReset()
    isShuttingDown.mockReset()
    registerKnxLink.mockReset()
    registerKnxConnectAttempt.mockReset()
    clearKnxConnectAttempt.mockReset()
    connect.mockResolvedValue(undefined)
    disconnect.mockResolvedValue(undefined)
  })

  it('registers and clears connect attempt around connect()', async () => {
    isShuttingDown.mockReturnValue(false)

    await knxInit(logger as never)

    expect(registerKnxConnectAttempt).toHaveBeenCalledOnce()
    expect(clearKnxConnectAttempt).toHaveBeenCalledOnce()
  })

  it('throws StartupAbortedError when connect is aborted during shutdown', async () => {
    connect.mockRejectedValue(new KnxLinkException('CONNECTION_ABORTED', 'Connection aborted'))

    await expect(knxInit(logger as never)).rejects.toBeInstanceOf(StartupAbortedError)

    expect(registerKnxConnectAttempt).toHaveBeenCalledOnce()
    expect(clearKnxConnectAttempt).toHaveBeenCalledOnce()
    expect(registerKnxLink).not.toHaveBeenCalled()
  })

  it('disconnects and throws StartupAbortedError when shutting down after connect', async () => {
    isShuttingDown.mockReturnValue(true)

    await expect(knxInit(logger as never)).rejects.toBeInstanceOf(StartupAbortedError)

    expect(connect).toHaveBeenCalledOnce()
    expect(disconnect).toHaveBeenCalledOnce()
    expect(registerKnxLink).not.toHaveBeenCalled()
  })

  it('registers KNX link when not shutting down', async () => {
    isShuttingDown.mockReturnValue(false)

    await knxInit(logger as never)

    expect(connect).toHaveBeenCalledOnce()
    expect(disconnect).not.toHaveBeenCalled()
    expect(registerKnxLink).toHaveBeenCalledOnce()
  })
})

import { afterEach, describe, expect, it, vi } from 'vitest'

const { captureException } = vi.hoisted(() => ({
  captureException: vi.fn(),
}))

vi.mock('@sentry/node', () => ({
  captureException,
}))

vi.mock('../env', () => ({
  isProduction: true,
}))

import { captureInvalidInput } from './captureInvalidInput'

describe('captureInvalidInput', () => {
  afterEach(() => {
    captureException.mockClear()
  })

  it('reports invalid input to Sentry in production', () => {
    captureInvalidInput('cv: invalid upload command args', 'not-json')

    expect(captureException).toHaveBeenCalledTimes(1)
    expect(captureException.mock.calls[0]?.[0]).toBeInstanceOf(Error)
    expect((captureException.mock.calls[0]?.[0] as Error).message).toBe('cv: invalid upload command args')
  })

  it('wraps Error cause', () => {
    const cause = new SyntaxError('Unexpected token')

    captureInvalidInput('cv: failed to parse upload command args', cause)

    const error = captureException.mock.calls[0]?.[0] as Error
    expect(error.message).toBe('cv: failed to parse upload command args')
    expect(error.cause).toBe(cause)
  })
})

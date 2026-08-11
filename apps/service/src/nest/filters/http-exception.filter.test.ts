import { ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

let isProduction = false

const silentLogger = {
  warn: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
  child: vi.fn(),
}

silentLogger.child.mockReturnValue(silentLogger)

vi.mock('@repo/env', () => ({
  get isProduction() {
    return isProduction
  },
  get isDevelopment() {
    return !isProduction
  },
}))

vi.mock('@/sentry', () => ({
  captureProductionError: vi.fn(),
}))

vi.mock('../logger/nest-logger', () => ({
  nestLogger: () => silentLogger,
}))

import { HttpExceptionFilter } from './http-exception.filter'

const createHost = (statusMock: ReturnType<typeof vi.fn>, jsonMock: ReturnType<typeof vi.fn>): ArgumentsHost =>
  ({
    getType: () => 'http',
    switchToHttp: () => ({
      getResponse: () => ({
        status: statusMock,
        json: jsonMock,
      }),
    }),
  }) as ArgumentsHost

describe('HttpExceptionFilter', () => {
  beforeEach(() => {
    isProduction = false
    vi.clearAllMocks()
  })

  afterEach(() => {
    isProduction = false
  })

  it('returns HttpException response unchanged', () => {
    const status = vi.fn().mockReturnValue({ json: vi.fn() })
    const json = vi.fn()
    status.mockReturnValue({ json })

    const filter = new HttpExceptionFilter()
    filter.catch(new HttpException('Validation failed', HttpStatus.BAD_REQUEST), createHost(status, json))

    expect(status).toHaveBeenCalledWith(HttpStatus.BAD_REQUEST)
    expect(json).toHaveBeenCalledWith('Validation failed')
  })

  it('returns detailed body-parser errors in development', () => {
    const status = vi.fn().mockReturnValue({ json: vi.fn() })
    const json = vi.fn()
    status.mockReturnValue({ json })

    const filter = new HttpExceptionFilter()
    const error = Object.assign(new Error('request entity too large'), {
      status: HttpStatus.PAYLOAD_TOO_LARGE,
      statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
      expose: true,
    })

    filter.catch(error, createHost(status, json))

    expect(status).toHaveBeenCalledWith(HttpStatus.PAYLOAD_TOO_LARGE)
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
      message: 'request entity too large',
    })
  })

  it('returns generic client response for unknown 5xx errors', () => {
    const status = vi.fn().mockReturnValue({ json: vi.fn() })
    const json = vi.fn()
    status.mockReturnValue({ json })

    const filter = new HttpExceptionFilter()
    filter.catch(new Error('something broke'), createHost(status, json))

    expect(status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR)
    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    })
  })

  it('sanitizes non-HttpException responses in production', () => {
    isProduction = true
    const status = vi.fn().mockReturnValue({ json: vi.fn() })
    const json = vi.fn()
    status.mockReturnValue({ json })

    const filter = new HttpExceptionFilter()
    const error = Object.assign(new Error('request entity too large'), {
      status: HttpStatus.PAYLOAD_TOO_LARGE,
      statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
      expose: true,
    })

    filter.catch(error, createHost(status, json))

    expect(json).toHaveBeenCalledWith({
      statusCode: HttpStatus.PAYLOAD_TOO_LARGE,
      message: 'Bad Request',
    })
  })
})

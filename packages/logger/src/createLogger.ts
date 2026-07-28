import pino from 'pino'
import { isProduction } from '@repo/env'
import { createJournaldStream } from './createJournaldStream'
import { isJournaldLoggingEnabled } from './isJournaldLoggingEnabled'
import { resolveRootLogLevel } from './logLevel'

export type CreateLoggerOptions = {
  name?: string
  destination?: pino.DestinationStream
  /** File descriptor when no custom destination is passed (default stdout). Used with LOG_JOURNALD=1. */
  fd?: number
}

function buildStream(destination: pino.DestinationStream): pino.DestinationStream {
  if (isProduction) {
    return destination
  }

  // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-var-requires
  const pretty = require('pino-pretty') as typeof import('pino-pretty')
  return pretty({
    colorize: true,
    translateTime: 'SYS:standard',
    hideObject: false,
    destination,
  })
}

export function createLogger(options: CreateLoggerOptions = {}): pino.Logger {
  const level = resolveRootLogLevel(options.name)
  const destination = options.destination ?? pino.destination(options.fd ?? 1)

  if (isJournaldLoggingEnabled()) {
    return pino({ name: options.name, level }, createJournaldStream(destination))
  }

  return pino({ name: options.name, level }, buildStream(destination))
}

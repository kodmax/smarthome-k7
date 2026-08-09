import pino, { type DestinationStream, type Level } from 'pino'
import { isProduction } from '@repo/env'
import { createJournaldStream } from './createJournaldStream'
import { isJournaldLoggingEnabled } from './isJournaldLoggingEnabled'
import { resolveRootLogLevel } from './logLevel'
import type { CreateLoggerOptions } from './createLogger'

export type PinoConfigOptions = {
  name?: string
  level: Level
}

function buildStream(destination: DestinationStream): DestinationStream {
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

export function createPinoConfig(options: CreateLoggerOptions = {}): [PinoConfigOptions, DestinationStream] {
  const level = resolveRootLogLevel(options.name)
  const destination = options.destination ?? pino.destination(options.fd ?? 1)
  const stream = isJournaldLoggingEnabled() ? createJournaldStream(destination) : buildStream(destination)

  return [{ name: options.name, level }, stream]
}

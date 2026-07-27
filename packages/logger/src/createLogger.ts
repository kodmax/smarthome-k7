import pino from 'pino'
import { isProduction } from '@repo/env'
import { resolveRootLogLevel } from './logLevel'

export type CreateLoggerOptions = {
  name?: string
  destination?: pino.DestinationStream
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
  const destination = options.destination ?? pino.destination(1)
  return pino({ name: options.name, level: resolveRootLogLevel(options.name) }, buildStream(destination))
}

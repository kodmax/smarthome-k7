import pino from 'pino'
import { isProduction } from '@repo/env'
import { readScopedLogLevel, resolveRootLogLevel } from './logLevel'

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
    hideObject: true,
    destination,
  })
}

function wrapLoggerWithComponentLevels(logger: pino.Logger): pino.Logger {
  const base = logger.child.bind(logger)

  return Object.assign(logger, {
    child(bindings: pino.Bindings, options?: pino.ChildLoggerOptions) {
      const component = bindings.component
      let childOptions = options

      if (typeof component === 'string') {
        const level = readScopedLogLevel(component)
        if (level !== undefined) {
          childOptions = { ...options, level }
        }
      }

      return wrapLoggerWithComponentLevels(base(bindings, childOptions))
    },
  })
}

export function createLogger(options: CreateLoggerOptions = {}): pino.Logger {
  const destination = options.destination ?? pino.destination(1)
  const logger = pino({ name: options.name, level: resolveRootLogLevel(options.name) }, buildStream(destination))

  return wrapLoggerWithComponentLevels(logger)
}

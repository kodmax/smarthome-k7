import { createLogger, type Logger } from '@repo/logger'

let logger: Logger | undefined

export function nestLogger(): Logger {
  logger ??= createLogger({ name: 'service' })
  return logger
}

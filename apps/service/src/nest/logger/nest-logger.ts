import { rootLogger, type Logger } from '@repo/logger'

let logger: Logger | undefined

export function nestLogger(): Logger {
  logger ??= rootLogger.child({ name: 'service-nest' })
  return logger
}

import { LoggerService } from '@nestjs/common'
import type { Logger } from '@repo/logger'
import { readScopedLogLevel } from '@repo/logger'

const NEST_FRAMEWORK_LOG = { source: 'nest-framework' } as const

export class PinoNestLoggerService implements LoggerService {
  private readonly frameworkLogger: Logger

  constructor(root: Logger) {
    this.frameworkLogger = root.child(NEST_FRAMEWORK_LOG)
  }

  private forContext(context?: string): Logger {
    if (context === undefined) {
      return this.frameworkLogger
    }

    const level = readScopedLogLevel(context)
    return level ? this.frameworkLogger.child({ context }, { level }) : this.frameworkLogger.child({ context })
  }

  log(message: string, context?: string): void {
    this.forContext(context).info(message)
  }

  error(message: string, trace?: string, context?: string): void {
    this.forContext(context).error(trace !== undefined ? { trace } : {}, message)
  }

  warn(message: string, context?: string): void {
    this.forContext(context).warn(message)
  }

  debug(message: string, context?: string): void {
    this.forContext(context).debug(message)
  }

  verbose(message: string, context?: string): void {
    this.forContext(context).debug(message)
  }
}

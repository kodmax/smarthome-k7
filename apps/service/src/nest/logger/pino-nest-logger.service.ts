import { Injectable, LoggerService } from '@nestjs/common'
import type { Logger } from '@repo/logger'

@Injectable()
export class PinoNestLoggerService implements LoggerService {
  private readonly logger: Logger

  constructor(rootLogger: Logger) {
    this.logger = rootLogger.child({ source: 'nest-framework' })
  }

  log(message: unknown, context?: string): void {
    this.write('info', message, context)
  }

  error(message: unknown, trace?: string, context?: string): void {
    if (trace) {
      this.logger.error({ context, trace }, String(message))
      return
    }
    this.write('error', message, context)
  }

  warn(message: unknown, context?: string): void {
    this.write('warn', message, context)
  }

  debug(message: unknown, context?: string): void {
    this.write('debug', message, context)
  }

  verbose(message: unknown, context?: string): void {
    this.write('trace', message, context)
  }

  private write(level: 'info' | 'error' | 'warn' | 'debug' | 'trace', message: unknown, context?: string): void {
    const msg = String(message)
    if (context) {
      this.logger[level]({ context }, msg)
      return
    }
    this.logger[level](msg)
  }
}

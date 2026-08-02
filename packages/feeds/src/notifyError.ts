import type { Level, Logger } from '@repo/logger'

export type ErrorHandler = (error: unknown, context: string) => void

export type LogContext = Record<string, unknown>

export const noopErrorHandler: ErrorHandler = () => void 0

export function notifyError(
  logger: Logger,
  onError: ErrorHandler,
  level: Level,
  context: string,
  error: unknown,
  fields?: LogContext,
): void {
  logger[level]({ err: error, ...fields }, context)
  onError(error, context)
}

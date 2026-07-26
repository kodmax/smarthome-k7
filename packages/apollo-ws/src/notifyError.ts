import type { ApolloEvents } from './ApolloEvents'

export type ErrorHandler = (error: unknown, context: string) => void

export const noopErrorHandler: ErrorHandler = () => void 0

export function notifyError(
  vent: ApolloEvents,
  onError: ErrorHandler,
  priority: number,
  context: string,
  error: unknown,
): void {
  vent.emit('sys-log', priority, context, error)
  onError(error, context)
}

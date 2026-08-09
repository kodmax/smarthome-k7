import pino from 'pino'
import { createPinoConfig } from './createPinoConfig'

export type CreateLoggerOptions = {
  name?: string
  destination?: pino.DestinationStream
  /** File descriptor when no custom destination is passed (default stdout). Used with LOG_JOURNALD=1. */
  fd?: number
}

export function createLogger(options: CreateLoggerOptions = {}): pino.Logger {
  const [pinoOptions, stream] = createPinoConfig(options)
  return pino({ name: pinoOptions.name, level: pinoOptions.level }, stream)
}

const rootLogger = createLogger()
export { rootLogger }

import type { Logger } from 'pino'
import { readScopedLogLevel } from './logLevel'

export function childComponentLogger(root: Logger, component: string): Logger {
  const level = readScopedLogLevel(component)
  return level ? root.child({ component }, { level }) : root.child({ component })
}

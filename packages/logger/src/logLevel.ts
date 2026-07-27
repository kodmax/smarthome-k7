import pino, { type Level } from 'pino'

const VALID_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal', 'silent'] as const

function isLogLevel(value: string | undefined): value is Level {
  return value !== undefined && (VALID_LEVELS as readonly string[]).includes(value)
}

/** Default minimum log level (`info` — filters trace and debug). */
export function defaultLogLevel(): Level {
  const aboveDebug = pino.levels.labels[pino.levels.values.debug + 10]
  return (aboveDebug ?? 'info') as Level
}

export function normalizeLogScope(scope: string): string {
  return scope.replace(/[^a-zA-Z0-9]+/g, '_').toUpperCase()
}

/** Reads `LOG_LEVEL_<SCOPE>` (e.g. `LOG_LEVEL_FEEDS` for component `feeds`). */
export function readScopedLogLevel(scope: string): Level | undefined {
  const key = `LOG_LEVEL_${normalizeLogScope(scope)}`
  return isLogLevel(process.env[key]) ? (process.env[key] as Level) : undefined
}

/** Reads global `LOG_LEVEL`, defaulting to `info`. */
export function readGlobalLogLevel(): Level {
  return isLogLevel(process.env.LOG_LEVEL) ? (process.env.LOG_LEVEL as Level) : defaultLogLevel()
}

/** Root logger: scoped name override, then global, then `info`. */
export function resolveRootLogLevel(name?: string): Level {
  if (name) {
    const scoped = readScopedLogLevel(name)
    if (scoped) {
      return scoped
    }
  }

  return readGlobalLogLevel()
}

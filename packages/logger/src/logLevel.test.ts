import { afterEach, describe, expect, it } from 'vitest'
import {
  defaultLogLevel,
  normalizeLogScope,
  readGlobalLogLevel,
  readScopedLogLevel,
  resolveRootLogLevel,
} from './logLevel'

const env = process.env

afterEach(() => {
  process.env = { ...env }
})

describe('normalizeLogScope', () => {
  it('uppercases and replaces separators with underscores', () => {
    expect(normalizeLogScope('feeds')).toBe('FEEDS')
    expect(normalizeLogScope('feeds-cron')).toBe('FEEDS_CRON')
    expect(normalizeLogScope('knx-cron')).toBe('KNX_CRON')
  })
})

describe('defaultLogLevel', () => {
  it('defaults to info', () => {
    expect(defaultLogLevel()).toBe('info')
  })
})

describe('readGlobalLogLevel', () => {
  it('defaults to info', () => {
    delete process.env.LOG_LEVEL
    expect(readGlobalLogLevel()).toBe(defaultLogLevel())
  })

  it('reads LOG_LEVEL when valid', () => {
    process.env.LOG_LEVEL = 'warn'
    expect(readGlobalLogLevel()).toBe('warn')
  })

  it('ignores invalid LOG_LEVEL', () => {
    process.env.LOG_LEVEL = 'verbose'
    expect(readGlobalLogLevel()).toBe(defaultLogLevel())
  })
})

describe('readScopedLogLevel', () => {
  it('reads LOG_LEVEL_<SCOPE> for a component', () => {
    process.env.LOG_LEVEL_FEEDS = 'debug'
    expect(readScopedLogLevel('feeds')).toBe('debug')
  })

  it('maps kebab-case components to underscored env keys', () => {
    process.env.LOG_LEVEL_FEEDS_CRON = 'trace'
    expect(readScopedLogLevel('feeds-cron')).toBe('trace')
  })
})

describe('resolveRootLogLevel', () => {
  it('prefers scoped name over global level', () => {
    process.env.LOG_LEVEL = 'warn'
    process.env.LOG_LEVEL_SERVICE = 'debug'
    expect(resolveRootLogLevel('service')).toBe('debug')
  })

  it('falls back to global level', () => {
    process.env.LOG_LEVEL = 'error'
    expect(resolveRootLogLevel('service')).toBe('error')
  })
})

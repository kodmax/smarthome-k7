import { afterEach, describe, expect, it } from 'vitest'
import { isJournaldLoggingEnabled } from './isJournaldLoggingEnabled'

const env = process.env

afterEach(() => {
  process.env = { ...env }
})

describe('isJournaldLoggingEnabled', () => {
  it('returns true for LOG_JOURNALD=1 and LOG_JOURNALD=true', () => {
    process.env.LOG_JOURNALD = '1'
    expect(isJournaldLoggingEnabled()).toBe(true)

    process.env.LOG_JOURNALD = 'true'
    expect(isJournaldLoggingEnabled()).toBe(true)
  })

  it('returns false when unset or other values', () => {
    delete process.env.LOG_JOURNALD
    expect(isJournaldLoggingEnabled()).toBe(false)

    process.env.LOG_JOURNALD = '0'
    expect(isJournaldLoggingEnabled()).toBe(false)
  })
})

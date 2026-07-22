import { describe, expect, it } from 'vitest'
import { formatAppliedDaysShort } from './formatAppliedDaysShort'

describe('formatAppliedDaysShort', () => {
  const now = new Date('2026-07-19T15:30:00')

  it('formats abbreviated applied days', () => {
    expect(formatAppliedDaysShort(null, now)).toBeNull()
    expect(formatAppliedDaysShort('2026-07-19T08:00:00', now)).toBe('0d')
    expect(formatAppliedDaysShort('2026-07-13T08:00:00', now)).toBe('6d')
  })
})

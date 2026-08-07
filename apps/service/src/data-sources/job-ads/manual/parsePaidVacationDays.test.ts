import { describe, expect, it } from 'vitest'
import { parsePaidVacationDays } from './parsePaidVacationDays'

describe('parsePaidVacationDays', () => {
  it('accepts valid day counts', () => {
    expect(parsePaidVacationDays(undefined)).toBeUndefined()
    expect(parsePaidVacationDays(null)).toBeUndefined()
    expect(parsePaidVacationDays('')).toBeUndefined()
    expect(parsePaidVacationDays(20)).toBe(20)
    expect(parsePaidVacationDays(0)).toBe(0)
  })

  it('rejects invalid values', () => {
    expect(parsePaidVacationDays(-1)).toBeNull()
    expect(parsePaidVacationDays(51)).toBeNull()
    expect(parsePaidVacationDays(1.5)).toBeNull()
    expect(parsePaidVacationDays('20')).toBeNull()
  })
})

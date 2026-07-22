import { describe, expect, it } from 'vitest'
import { isPublishedToday } from './publishedToday'

describe('isPublishedToday', () => {
  const now = new Date('2026-07-19T15:30:00')

  it('returns true when published on the same calendar day', () => {
    expect(isPublishedToday('2026-07-19T08:00:00.000Z', now)).toBe(true)
  })

  it('returns false when published on a previous calendar day', () => {
    expect(isPublishedToday('2026-07-18T08:00:00.000Z', now)).toBe(false)
  })
})

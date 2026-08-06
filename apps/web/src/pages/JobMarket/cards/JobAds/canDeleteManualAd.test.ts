import { describe, expect, it } from 'vitest'
import { canDeleteManualAd, MANUAL_DELETE_WINDOW_MS } from './canDeleteManualAd'

describe('canDeleteManualAd', () => {
  it('returns true within 24h window', () => {
    const now = Date.parse('2026-08-06T12:00:00.000Z')
    const addedAt = new Date(now - MANUAL_DELETE_WINDOW_MS + 60_000).toISOString()

    expect(canDeleteManualAd(addedAt, now)).toBe(true)
  })

  it('returns false after 24h window', () => {
    const now = Date.parse('2026-08-06T12:00:00.000Z')
    const addedAt = new Date(now - MANUAL_DELETE_WINDOW_MS).toISOString()

    expect(canDeleteManualAd(addedAt, now)).toBe(false)
  })

  it('returns false when addedAt missing', () => {
    expect(canDeleteManualAd(null)).toBe(false)
  })
})

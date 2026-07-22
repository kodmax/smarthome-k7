import { describe, expect, it } from 'vitest'
import { percentile } from './percentile'

describe('percentile', () => {
  it('returns null for an empty array', () => {
    expect(percentile([], 90)).toBeNull()
  })

  it('returns the only value for a single-item array', () => {
    expect(percentile([42], 90)).toBe(42)
  })

  it('computes P90 using nearest-rank method', () => {
    expect(percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 90)).toBe(9)
  })

  it('computes P50 as median for an odd-length array', () => {
    expect(percentile([1, 2, 3, 4, 5], 50)).toBe(3)
  })
})

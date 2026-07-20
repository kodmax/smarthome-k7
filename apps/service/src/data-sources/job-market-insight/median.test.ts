import { describe, expect, it } from 'vitest'
import { median } from './median'

describe('median', () => {
  it('returns null for an empty list', () => {
    expect(median([])).toBeNull()
  })

  it('returns the middle value for an odd-length list', () => {
    expect(median([3, 1, 2])).toBe(2)
  })

  it('returns the average of two middle values for an even-length list', () => {
    expect(median([4, 1, 3, 2])).toBe(2.5)
  })
})

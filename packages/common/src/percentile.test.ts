import { describe, expect, it } from 'vitest'
import { percentile, percentileOf, filterByPercentileOf } from './percentile'

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

  it('accounts for lower placeholders when computing the index', () => {
    expect(percentile([12, 18, 24, 30, 32, 34, 36, 38, 40, 42], 80, 20)).toBe(30)
    expect(percentile([12, 18, 24, 30, 32, 34, 36, 38, 40, 42], 80)).toBe(38)
  })
})

describe('percentileOf', () => {
  it('returns null when no mapped values exist', () => {
    expect(percentileOf([{ value: undefined }, { value: undefined }], 80, item => item.value)).toBeNull()
  })

  it('maps items to values and treats undefined as lower placeholders', () => {
    const salaryItems = [12, 18, 24, 30, 32, 34, 36, 38, 40, 42].map(salary => ({ salary }))
    const withMissing = [
      ...salaryItems,
      ...Array.from({ length: 20 }, () => ({ salary: undefined as number | undefined })),
    ]

    expect(percentileOf(salaryItems, 80, item => item.salary)).toBe(38)
    expect(percentileOf(withMissing, 80, item => item.salary)).toBe(30)
  })

  it('returns items at or above the percentile threshold', () => {
    const items = [
      { salary: 32_000 },
      { salary: 32_000 },
      { salary: 30_000 },
      { salary: 22_000 },
      { salary: undefined },
      ...Array.from({ length: 6 }, () => ({ salary: 10_000 as number | undefined })),
    ]

    expect(filterByPercentileOf(items, 80, item => item.salary)).toEqual([
      { salary: 32_000 },
      { salary: 32_000 },
      { salary: 30_000 },
    ])
  })

  it('returns an empty list when no mapped values exist', () => {
    expect(filterByPercentileOf([{ salary: undefined }], 80, item => item.salary)).toEqual([])
  })
})

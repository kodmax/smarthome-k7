import { describe, expect, it } from 'vitest'
import { computeJobMarketInsightChanges } from './computeJobMarketInsightChanges'

const metrics = (overrides: Partial<Parameters<typeof computeJobMarketInsightChanges>[0]> = {}) => ({
  adsCount: 425,
  newOffersCount: 93,
  medianSalary: 18_642,
  offersWithSalaryRangePercent: 74,
  remoteWorkPercent: 52,
  permanentEmploymentPercent: 61,
  popularTechnologies: [],
  salaryDistribution: [],
  ...overrides,
})

describe('computeJobMarketInsightChanges', () => {
  it('computes absolute and relative changes for count metrics', () => {
    expect(computeJobMarketInsightChanges(metrics(), metrics({ adsCount: 169 })).adsCount).toEqual({
      absolute: 256,
      relativePercent: 151.5,
    })
  })

  it('returns null relative percent when previous count is zero', () => {
    expect(computeJobMarketInsightChanges(metrics({ adsCount: 10 }), metrics({ adsCount: 0 })).adsCount).toEqual({
      absolute: 10,
      relativePercent: null,
    })
  })

  it('computes percentage point changes for share metrics', () => {
    expect(
      computeJobMarketInsightChanges(metrics(), metrics({ offersWithSalaryRangePercent: 69 }))
        .offersWithSalaryRangePercent,
    ).toEqual({
      absolute: 5,
    })
  })

  it('returns null median change when either median is missing', () => {
    expect(
      computeJobMarketInsightChanges(metrics({ medianSalary: null }), metrics({ medianSalary: 17_000 })).medianSalary,
    ).toBeNull()
  })
})

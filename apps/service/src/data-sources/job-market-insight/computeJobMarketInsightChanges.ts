import {
  JobMarketInsightChanges,
  JobMarketInsightCountChange,
  JobMarketInsightMetrics,
  JobMarketInsightPercentagePointChange,
} from '@repo/types'

const computeCountChange = (current: number, previous: number): JobMarketInsightCountChange => ({
  absolute: current - previous,
  relativePercent: previous === 0 ? null : Math.round(((current - previous) / previous) * 1000) / 10,
})

const computePercentagePointChange = (current: number, previous: number): JobMarketInsightPercentagePointChange => ({
  absolute: current - previous,
})

const computeMedianSalaryChange = (
  current: number | null,
  previous: number | null,
): JobMarketInsightCountChange | null => {
  if (current === null || previous === null) {
    return null
  }

  return computeCountChange(current, previous)
}

export const computeJobMarketInsightChanges = (
  current: JobMarketInsightMetrics,
  previous: JobMarketInsightMetrics,
): JobMarketInsightChanges => ({
  adsCount: computeCountChange(current.adsCount, previous.adsCount),
  newOffersCount: computeCountChange(current.newOffersCount, previous.newOffersCount),
  medianSalary: computeMedianSalaryChange(current.medianSalary, previous.medianSalary),
  offersWithSalaryRangePercent: computePercentagePointChange(
    current.offersWithSalaryRangePercent,
    previous.offersWithSalaryRangePercent,
  ),
  remoteWorkPercent: computePercentagePointChange(current.remoteWorkPercent, previous.remoteWorkPercent),
  permanentEmploymentPercent: computePercentagePointChange(
    current.permanentEmploymentPercent,
    previous.permanentEmploymentPercent,
  ),
})

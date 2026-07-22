import { JobAd } from '@repo/types'
import { filterByPercentileOf, percentileOf } from '@repo/common'

export const SALARY_INSIGHT_PERCENTILE = 90

const p90SalaryUpperBound = (ad: JobAd): number | undefined => ad.monthlySalaryRangeAfterTaxes?.to

export const computeP90Salary = (ads: JobAd[]): number => {
  const result = percentileOf(ads, SALARY_INSIGHT_PERCENTILE, p90SalaryUpperBound)

  return result === null ? 0 : Math.round(result)
}

export const countP90Offers = (ads: JobAd[]): number =>
  filterByPercentileOf(ads, SALARY_INSIGHT_PERCENTILE, p90SalaryUpperBound).length

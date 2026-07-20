import { JobAd } from '@repo/types'
import { median } from './median'

export const salaryUpperBounds = (ads: JobAd[]): number[] =>
  ads.flatMap(ad => {
    const range = ad.monthlySalaryRangeAfterTaxes
    if (range === undefined) {
      return []
    }

    return [range.to]
  })

export const computeMedianSalary = (ads: JobAd[]): number | null => {
  const result = median(salaryUpperBounds(ads))

  return result === null ? null : Math.round(result)
}

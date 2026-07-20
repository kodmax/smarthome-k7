import { JobAd } from '@repo/types'
import { median } from './median'

export const computeMedianSalary = (ads: JobAd[]): number | null => {
  const midpoints = ads.flatMap(ad => {
    const range = ad.monthlySalaryRangeAfterTaxes
    if (range === undefined) {
      return []
    }

    return [(range.from + range.to) / 2]
  })

  const result = median(midpoints)

  return result === null ? null : Math.round(result)
}

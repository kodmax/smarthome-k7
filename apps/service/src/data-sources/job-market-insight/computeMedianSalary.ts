import { JobAd } from '@repo/types'
import { median } from './median'

export const computeMedianSalary = (ads: JobAd[]): number => {
  const result = median(
    ads.map(ad => ad.monthlySalaryRangeAfterTaxes?.to).filter((value): value is number => value !== undefined),
  )

  return result === null ? 0 : Math.round(result)
}

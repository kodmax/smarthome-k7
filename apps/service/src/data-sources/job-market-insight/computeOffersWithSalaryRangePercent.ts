import { JobAd } from '@repo/types'

export const computeOffersWithSalaryRangePercent = (ads: JobAd[]): number => {
  if (ads.length === 0) {
    return 0
  }

  const withSalary = ads.filter(ad => ad.monthlySalaryRangeAfterTaxes !== undefined).length

  return Math.round((withSalary / ads.length) * 100)
}

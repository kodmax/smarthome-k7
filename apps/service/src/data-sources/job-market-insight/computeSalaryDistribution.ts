import { JobAd, JobMarketSalaryDistributionBracket } from '@repo/types'

export const SALARY_DISTRIBUTION_BRACKET_ORDER = [
  'above35k',
  'from30to35k',
  'from25to30k',
  'from20to25k',
  'from15to20k',
  'from10to15k',
  'below10k',
] as const satisfies readonly JobMarketSalaryDistributionBracket['id'][]

type SalaryBucketCounts = Record<JobMarketSalaryDistributionBracket['id'], number>

const emptyBuckets = (): SalaryBucketCounts => ({
  below10k: 0,
  from10to15k: 0,
  from15to20k: 0,
  from20to25k: 0,
  from25to30k: 0,
  from30to35k: 0,
  above35k: 0,
})

export const classifySalaryUpperBound = (upperBound: number): JobMarketSalaryDistributionBracket['id'] => {
  if (upperBound < 10_000) {
    return 'below10k'
  }

  if (upperBound < 15_000) {
    return 'from10to15k'
  }

  if (upperBound < 20_000) {
    return 'from15to20k'
  }

  if (upperBound < 25_000) {
    return 'from20to25k'
  }

  if (upperBound < 30_000) {
    return 'from25to30k'
  }

  if (upperBound < 35_000) {
    return 'from30to35k'
  }

  return 'above35k'
}

export const computeSalaryDistribution = (ads: JobAd[]): JobMarketSalaryDistributionBracket[] => {
  const counts = emptyBuckets()
  const adsWithSalary = ads.filter(ad => ad.monthlySalaryRangeAfterTaxes !== undefined)

  for (const ad of adsWithSalary) {
    const range = ad.monthlySalaryRangeAfterTaxes
    if (range === undefined) {
      continue
    }

    const bucket = classifySalaryUpperBound(range.to)
    counts[bucket] += 1
  }

  const total = adsWithSalary.length

  return SALARY_DISTRIBUTION_BRACKET_ORDER.map(id => ({
    id,
    percentage: total === 0 ? 0 : Math.round((counts[id] / total) * 100),
  }))
}

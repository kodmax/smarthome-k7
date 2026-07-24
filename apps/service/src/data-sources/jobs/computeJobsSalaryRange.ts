import { JobAd, JobsSalaryRange } from '@repo/types'

export const computeJobsSalaryRange = (ads: JobAd[]): JobsSalaryRange | null => {
  let min: number | undefined
  let max: number | undefined

  for (const ad of ads) {
    const range = ad.monthlySalaryRangeAfterTaxes
    if (range === undefined) {
      continue
    }

    min = min === undefined ? range.from : Math.min(min, range.from)
    max = max === undefined ? range.to : Math.max(max, range.to)
  }

  if (min === undefined || max === undefined) {
    return null
  }

  return { min, max }
}

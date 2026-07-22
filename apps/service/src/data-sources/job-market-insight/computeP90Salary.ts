import { JobAd } from '@repo/types'
import { salaryUpperBounds } from './computeMedianSalary'
import { percentile } from './percentile'

export const computeP90Salary = (ads: JobAd[]): number => {
  const result = percentile(salaryUpperBounds(ads), 90)

  return result === null ? 0 : Math.round(result)
}

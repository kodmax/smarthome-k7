import { type JobAd } from '@repo/types'

export type FormattedJobSalary = {
  monthlySalaryFrom: number | null
  monthlySalaryTo: number | null
  b2bHourlyRateEquivalent: number | null
}

export function formatJobSalary(ad: Pick<JobAd, 'monthlySalaryRangeAfterTaxes'>): FormattedJobSalary {
  if (ad.monthlySalaryRangeAfterTaxes === undefined) {
    return {
      monthlySalaryFrom: null,
      monthlySalaryTo: null,
      b2bHourlyRateEquivalent: null,
    }
  }

  const { from, to } = ad.monthlySalaryRangeAfterTaxes

  return {
    monthlySalaryFrom: Math.round(from / 1000),
    monthlySalaryTo: Math.round(to / 1000),
    b2bHourlyRateEquivalent: Math.round((to / 0.88 + 1000) / 150),
  }
}

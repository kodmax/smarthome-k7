import { type JobAd } from '@repo/types'

export type FormattedJobSalary = {
  monthlySalaryFrom: number | null
  monthlySalaryTo: number | null
  b2bHourlyRateEquivalent: number | null
}

export type FormatJobSalaryInput = {
  monthlySalaryRangeAfterTaxes?: JobAd['monthlySalaryRangeAfterTaxes']
  takeHomeHourlyRate?: JobAd['takeHomeHourlyRate']
}

export function formatJobSalary(ad: FormatJobSalaryInput): FormattedJobSalary {
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
    monthlySalaryTo: Math.round(to / 100) / 10,
    b2bHourlyRateEquivalent: ad.takeHomeHourlyRate ?? null,
  }
}

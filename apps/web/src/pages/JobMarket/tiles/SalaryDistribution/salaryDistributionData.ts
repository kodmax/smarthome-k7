export type SalaryBracketKey =
  | 'below20k'
  | 'from20to25k'
  | 'from25to30k'
  | 'from30to35k'
  | 'from35to40k'
  | 'above40k'
  | 'noSalaryRange'

export type SalaryDistributionBracket = {
  id: string
  labelKey: SalaryBracketKey
  percentage: number
}

export const salaryDistributionBrackets: SalaryDistributionBracket[] = [
  { id: 'above-40k', labelKey: 'above40k', percentage: 7 },
  { id: '35k-40k', labelKey: 'from35to40k', percentage: 14 },
  { id: '30k-35k', labelKey: 'from30to35k', percentage: 24 },
  { id: '25k-30k', labelKey: 'from25to30k', percentage: 28 },
  { id: '20k-25k', labelKey: 'from20to25k', percentage: 18 },
  { id: 'below-20k', labelKey: 'below20k', percentage: 6 },
  { id: 'no-salary-range', labelKey: 'noSalaryRange', percentage: 3 },
]

export const salaryDistributionAxisTicks = [0, 10, 20, 30, 40] as const

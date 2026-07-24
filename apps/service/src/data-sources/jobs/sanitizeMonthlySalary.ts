import { SalaryRange } from '@repo/types'

export const MIN_PLAUSIBLE_MONTHLY_NET = 5_000

export function sanitizeMonthlySalaryRange(range: SalaryRange): SalaryRange | undefined {
  if (range.from < MIN_PLAUSIBLE_MONTHLY_NET) {
    return undefined
  }

  return range
}

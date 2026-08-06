import { SalaryRange } from '@repo/types'

type ManualEmploymentType = 'permanent' | 'b2b'

function reversePermanentMonthlyGross(net: number): number {
  return Math.round(net / 0.6)
}

function reverseB2bMonthlyGross(net: number): number {
  return Math.round(((net * 12 + 12_000) * 2008) / (12 * 1800 * 0.88))
}

export function reverseManualJobAdSalary(
  employmentType: ManualEmploymentType,
  range: SalaryRange | undefined,
): { salaryFrom?: number; salaryTo?: number } {
  if (range === undefined) {
    return {}
  }

  const reverse = employmentType === 'permanent' ? reversePermanentMonthlyGross : reverseB2bMonthlyGross

  return {
    salaryFrom: reverse(range.from),
    salaryTo: reverse(range.to),
  }
}

import { SalaryRange } from '@repo/types'

type ManualEmploymentType = 'permanent' | 'b2b'

const ANNUAL_WORK_HOURS = 2008
const PLANNED_WORK_HOURS = 1800
const HOURS_PER_VACATION_DAY = 8

function reversePermanentMonthlyGross(net: number): number {
  return Math.round(net / 0.6)
}

function reverseB2bMonthlyRate(net: number, paidVacationDays?: number): number {
  const vacationHours = paidVacationDays === undefined ? 0 : paidVacationDays * HOURS_PER_VACATION_DAY
  const annualFromPlannedWork = (net * 12 + 12_000) / 0.88
  const hourlyRate = annualFromPlannedWork / PLANNED_WORK_HOURS
  return Math.round((hourlyRate * (ANNUAL_WORK_HOURS - vacationHours)) / 12)
}

export function reverseManualJobAdSalary(
  employmentType: ManualEmploymentType,
  range: SalaryRange | undefined,
  paidVacationDays?: number,
): { salaryFrom?: number; salaryTo?: number } {
  if (range === undefined) {
    return {}
  }

  const reverse =
    employmentType === 'permanent'
      ? reversePermanentMonthlyGross
      : (net: number) => reverseB2bMonthlyRate(net, paidVacationDays)

  return {
    salaryFrom: reverse(range.from),
    salaryTo: reverse(range.to),
  }
}

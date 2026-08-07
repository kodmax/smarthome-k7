import { EmploymentType, SalaryRange } from '@repo/types'
import { getMonthlySalaryAfterTax } from '../getMonthlySalaryAfterTax'
import { sanitizeMonthlySalaryRange } from '../sanitizeMonthlySalary'

export function buildManualJobAdSalary(
  employmentType: EmploymentType,
  salaryFrom: number | undefined,
  salaryTo: number | undefined,
  paidVacationDays?: number,
): SalaryRange | undefined {
  if (salaryFrom === undefined && salaryTo === undefined) {
    return undefined
  }

  const from = salaryFrom ?? salaryTo
  const to = salaryTo ?? salaryFrom
  if (from === undefined || to === undefined) {
    return undefined
  }

  const vacationDays = employmentType === 'b2b' ? paidVacationDays : undefined

  return sanitizeMonthlySalaryRange(getMonthlySalaryAfterTax(employmentType, 'Month', from, to, vacationDays))
}

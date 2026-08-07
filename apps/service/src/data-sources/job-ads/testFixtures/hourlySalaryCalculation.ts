import type { JobAdsHourlySalaryCalculation } from '@repo/types'

export const DEFAULT_HOURLY_SALARY_CALCULATION: JobAdsHourlySalaryCalculation = {
  vacationDaysPerYear: 26,
  workingDaysPerYear: 251,
  workingDaysPerWeek: 5,
  timeSpentRemote: 8,
  timeSpentOffice: 9,
  hybridOfficeDaysPerWeek: 3,
}

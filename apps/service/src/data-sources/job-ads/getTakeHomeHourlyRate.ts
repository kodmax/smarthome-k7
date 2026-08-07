import type { JobAdsHourlySalaryCalculation, SalaryRange, WorkplaceType } from '@repo/types'

const DEFAULT_HOURS_PER_WORKING_DAY = 8

function computeWeeklyHoursSpent(
  workplaceType: WorkplaceType | undefined,
  calculation: JobAdsHourlySalaryCalculation,
): number {
  const { workingDaysPerWeek, timeSpentRemote, timeSpentOffice, hybridOfficeDaysPerWeek } = calculation

  if (workplaceType === 'remote') {
    return workingDaysPerWeek * timeSpentRemote
  }

  if (workplaceType === 'office') {
    return workingDaysPerWeek * timeSpentOffice
  }

  if (workplaceType === 'hybrid') {
    const remoteDaysPerWeek = workingDaysPerWeek - hybridOfficeDaysPerWeek
    return remoteDaysPerWeek * timeSpentRemote + hybridOfficeDaysPerWeek * timeSpentOffice
  }

  return workingDaysPerWeek * DEFAULT_HOURS_PER_WORKING_DAY
}

function computeMonthlyHoursSpent(
  workplaceType: WorkplaceType | undefined,
  calculation: JobAdsHourlySalaryCalculation,
): number {
  const { vacationDaysPerYear, workingDaysPerYear, workingDaysPerWeek } = calculation
  const workingDaysPerMonth = (workingDaysPerYear - vacationDaysPerYear) / 12
  const weeklyHoursSpent = computeWeeklyHoursSpent(workplaceType, calculation)

  return (workingDaysPerMonth / workingDaysPerWeek) * weeklyHoursSpent
}

export function getTakeHomeHourlyRate(
  monthlySalaryRangeAfterTaxes: SalaryRange | undefined,
  workplaceType: WorkplaceType | undefined,
  calculation: JobAdsHourlySalaryCalculation,
): number | undefined {
  if (monthlySalaryRangeAfterTaxes === undefined) {
    return undefined
  }

  const monthlyHoursSpent = computeMonthlyHoursSpent(workplaceType, calculation)

  return Math.round(monthlySalaryRangeAfterTaxes.to / monthlyHoursSpent)
}

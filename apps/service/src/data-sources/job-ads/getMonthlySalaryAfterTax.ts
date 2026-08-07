import { SalaryRange, SalaryUnit, ContractType } from '@repo/types'

const unitMultiplier: Record<SalaryUnit, number> = {
  Hour: 2008,
  Day: 251,
  Month: 12,
  Year: 1,
}

export const ANNUAL_WORK_HOURS = 2008
export const PLANNED_WORK_HOURS = 1800
const HOURS_PER_VACATION_DAY = 8

function vacationHours(paidVacationDays?: number): number {
  return paidVacationDays === undefined ? 0 : paidVacationDays * HOURS_PER_VACATION_DAY
}

function b2bNetFromAnnualContractValue(annualContractValue: number, paidVacationDays?: number): number {
  const billableDenominator = ANNUAL_WORK_HOURS - vacationHours(paidVacationDays)
  return Math.round(((annualContractValue / billableDenominator) * PLANNED_WORK_HOURS * 0.88 - 12_000) / 12)
}

export const getMonthlySalaryAfterTax = (
  contractType: ContractType,
  unit: SalaryUnit,
  from: number,
  to: number,
  paidVacationDays?: number,
): SalaryRange => {
  switch (contractType) {
    case 'permanent':
    case 'internship':
    case 'intern':
      return {
        from: Math.round((from * unitMultiplier[unit] * 0.6) / 12),
        to: Math.round((to * unitMultiplier[unit] * 0.6) / 12),
      }

    case 'b2b':
    case 'any':
      return {
        from: b2bNetFromAnnualContractValue(from * unitMultiplier[unit], paidVacationDays),
        to: b2bNetFromAnnualContractValue(to * unitMultiplier[unit], paidVacationDays),
      }

    case 'uod':
    case 'mandate_contract':
    case 'contract':
      return {
        from: Math.round((((from * unitMultiplier[unit]) / ANNUAL_WORK_HOURS) * PLANNED_WORK_HOURS * 0.88) / 12),
        to: Math.round((((to * unitMultiplier[unit]) / ANNUAL_WORK_HOURS) * PLANNED_WORK_HOURS * 0.88) / 12),
      }

    default: {
      const unexpected: never = contractType
      throw new Error(`Unknown contract type: ${String(unexpected)}`)
    }
  }
}

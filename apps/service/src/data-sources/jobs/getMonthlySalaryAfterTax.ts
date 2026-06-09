import { SalaryRange, SalaryUnit, ContractType } from '@repo/types'

const unitMultiplier: Record<SalaryUnit, number> = {
  Hour: 2008,
  Day: 251,
  Month: 12,
  Year: 1,
}

export const getMonthlySalaryAfterTax = (
  contractType: ContractType,
  unit: SalaryUnit,
  from: number,
  to: number,
): SalaryRange | undefined => {
  switch (contractType) {
    case 'permanent':
      return {
        from: Math.round((from * unitMultiplier[unit] * 0.6) / 12),
        to: Math.round((to * unitMultiplier[unit] * 0.6) / 12),
      }

    case 'b2b':
      return {
        from: Math.round((((from * unitMultiplier[unit]) / 2008) * 1800 * 0.88 - 12000) / 12),
        to: Math.round((((to * unitMultiplier[unit]) / 2008) * 1800 * 0.88 - 12000) / 12),
      }
  }
}

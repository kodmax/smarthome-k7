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
): SalaryRange => {
  switch (contractType) {
    case 'permanent':
    case 'internship':
      return {
        from: Math.round((from * unitMultiplier[unit] * 0.6) / 12),
        to: Math.round((to * unitMultiplier[unit] * 0.6) / 12),
      }

    case 'b2b':
    case 'any':
      return {
        from: Math.round((((from * unitMultiplier[unit]) / 2008) * 1800 * 0.88 - 12_000) / 12),
        to: Math.round((((to * unitMultiplier[unit]) / 2008) * 1800 * 0.88 - 12_000) / 12),
      }

    case 'uod':
    case 'mandate_contract':
    case 'contract':
      return {
        from: Math.round((((from * unitMultiplier[unit]) / 2008) * 1800 * 0.88) / 12),
        to: Math.round((((to * unitMultiplier[unit]) / 2008) * 1800 * 0.88) / 12),
      }

    default: {
      const unexpected: never = contractType
      throw new Error(`Unknown contract type: ${String(unexpected)}`)
    }
  }
}

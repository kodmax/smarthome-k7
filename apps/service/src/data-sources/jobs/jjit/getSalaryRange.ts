import { SalaryRange } from '@repo/types'
import { JJEmploymentType } from './types'

const unitMultiplier = {
  Hour: 2008,
  Day: 251,
  Month: 12,
  Year: 1,
}

export const getSalaryRange = (jjEmploymentType: JJEmploymentType): SalaryRange | undefined => {
  if (jjEmploymentType.fromPerUnit === null || jjEmploymentType.toPerUnit === null) {
    return undefined
  }

  switch (jjEmploymentType.type) {
    case 'permanent':
      return {
        from: Math.round((jjEmploymentType.fromPerUnit * unitMultiplier[jjEmploymentType.unit] * 0.6) / 12),
        to: Math.round((jjEmploymentType.toPerUnit * unitMultiplier[jjEmploymentType.unit] * 0.6) / 12),
      }

    case 'b2b':
    case 'any':
    case 'mandate_contract':
      return {
        from: Math.round(
          (((jjEmploymentType.fromPerUnit * unitMultiplier[jjEmploymentType.unit]) / 2008) * 1800 * 0.88 - 12000) / 12,
        ),
        to: Math.round(
          (((jjEmploymentType.toPerUnit * unitMultiplier[jjEmploymentType.unit]) / 2008) * 1800 * 0.88 - 12000) / 12,
        ),
      }

    default:
      throw new Error('Unknown employment type: ' + jjEmploymentType.type)
  }
}

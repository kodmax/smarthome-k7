import { JobAdOriginalSalary, SalaryRange } from '@repo/types'
import { getMonthlySalaryAfterTax } from './getMonthlySalaryAfterTax'
import type { NbpTableARates } from './nbp/fetchNbpTableARates'
import { sanitizeMonthlySalaryRange } from './sanitizeMonthlySalary'

function toPlnRate(currency: JobAdOriginalSalary['currency'], nbpRates: NbpTableARates): number | undefined {
  if (currency === 'PLN') {
    return 1
  }

  return nbpRates[currency]
}

export function resolveMonthlySalaryFromOriginal(
  originalSalary: JobAdOriginalSalary | undefined,
  nbpRates: NbpTableARates,
): SalaryRange | undefined {
  if (originalSalary === undefined) {
    return undefined
  }

  const rate = toPlnRate(originalSalary.currency, nbpRates)
  if (rate === undefined) {
    return undefined
  }

  const plnFrom = originalSalary.from * rate
  const plnTo = originalSalary.to * rate
  const monthly = getMonthlySalaryAfterTax('b2b', originalSalary.period, plnFrom, plnTo)

  return sanitizeMonthlySalaryRange(monthly)
}

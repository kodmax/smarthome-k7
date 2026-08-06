import { JobAd, SalaryUnit, WorkplaceType } from '@repo/types'
import { Ad, Contract } from './types'
import { getMonthlySalaryAfterTax } from '../getMonthlySalaryAfterTax'
import { sanitizeMonthlySalaryRange } from '../sanitizeMonthlySalary'
import { toIsoDate } from '../toIsoDate'
import { digestTheprotocolId } from './digestTheprotocolId'

export const toJobAd = (ad: Ad): JobAd | null => {
  const contractTypes: Contract[] = ad.typesOfContracts
    .filter(item => item.salary !== null)
    .map((item): Contract => {
      const salary = item.salary
      if (salary === null) {
        throw new Error('No salary')
      }

      const contractType = salary.kindName === 'brutto' || salary.kindName === 'gross' ? 'permanent' : 'b2b'
      const timeUnit: SalaryUnit = salary.timeUnitId === 0 ? 'Month' : 'Hour'

      return {
        salaryRange: getMonthlySalaryAfterTax(contractType, timeUnit, salary.from, salary.to),
        type: contractType,
      }
    })

  if (contractTypes.length < 1) {
    return null
  }

  contractTypes.sort((a, b) => b.salaryRange.to - a.salaryRange.to)
  const bestContractType = contractTypes[0]

  const workplaceType: WorkplaceType =
    ad.workModes.includes('zdalna') || ad.workModes.includes('remote')
      ? 'remote'
      : ad.workModes.includes('hybrydowa') || ad.workModes.includes('hybrid')
        ? 'hybrid'
        : 'office'

  return {
    id: digestTheprotocolId(ad.offerUrlName),
    title: ad.title,
    advertUrl: `https://theprotocol.it/szczegoly/praca/${ad.offerUrlName}`,
    companyLogoUrl: ad.logoUrl,
    companyName: ad.employer,
    requiredSkills: ad.technologies,
    workplaceType,
    employmentType: bestContractType.type,
    monthlySalaryRangeAfterTaxes: sanitizeMonthlySalaryRange(bestContractType.salaryRange),
    origin: 'theprotocol',
    publishedAt: toIsoDate(ad.publicationDateUtc),
  }
}

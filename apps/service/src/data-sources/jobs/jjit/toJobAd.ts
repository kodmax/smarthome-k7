import { JobAd } from '@repo/types'
import { JustJoinAd } from './types'
import { isUnwantedCompany } from '../filters'
import { getMonthlySalaryAfterTax } from '../getMonthlySalaryAfterTax'

export const toJobAd = (jjAd: JustJoinAd): JobAd => {
  const jjEmploymentType = jjAd.employmentTypes.find(item => item.currency === 'PLN')

  return {
    id: jjAd.guid,
    origin: 'jj',
    title: jjAd.title,
    advertUrl: `https://justjoin.it/job-offer/${jjAd.slug}`,
    companyLogoUrl: jjAd.companyLogoThumbUrl,
    companyName: jjAd.companyName,
    requiredSkills: jjAd.requiredSkills.map(item => item.name),
    workplaceType: jjAd.workplaceType,
    employmentType: jjEmploymentType?.type === 'permanent' ? 'permanent' : 'b2b',
    isUnwantedCompany: isUnwantedCompany(jjAd.companyName),
    monthlySalaryRangeAfterTaxes:
      jjEmploymentType !== undefined && jjEmploymentType.fromPerUnit !== null && jjEmploymentType.toPerUnit !== null
        ? getMonthlySalaryAfterTax(
            jjEmploymentType.type === 'permanent' ? 'permanent' : 'b2b',
            jjEmploymentType.unit,
            jjEmploymentType.fromPerUnit,
            jjEmploymentType.toPerUnit,
          )
        : undefined,
  }
}

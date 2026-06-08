import { JobAd } from '@repo/types'
import { JustJoinAd } from './types'
import { getSalaryRange } from './getSalaryRange'
import { isUnwantedCompany } from '../filters'

export const toJobAd = (jjAd: JustJoinAd): JobAd => {
  const jjEmploymentType = jjAd.employmentTypes.find(item => item.currency === 'PLN')

  return {
    id: jjAd.guid,
    title: jjAd.title,
    advertUrl: `https://justjoin.it/job-offer/${jjAd.slug}`,
    companyLogoUrl: jjAd.companyLogoThumbUrl,
    companyName: jjAd.companyName,
    requiredSkills: jjAd.requiredSkills.map(item => item.name),
    workplaceType: jjAd.workplaceType,
    employmentType: jjEmploymentType?.type === 'permanent' ? 'permanent' : 'b2b',
    monthlySalaryRangeAfterTaxes: jjEmploymentType !== undefined ? getSalaryRange(jjEmploymentType) : undefined,
    isUnwantedCompany: isUnwantedCompany(jjAd.companyName),
  }
}

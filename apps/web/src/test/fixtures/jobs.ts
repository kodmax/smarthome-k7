import { type JobAd } from '@repo/types'

type JobAdOverrides = Partial<JobAd> & Pick<JobAd, 'id' | 'title'>

export function jobAd(overrides: JobAdOverrides): JobAd {
  return {
    advertUrl: 'https://example.com/job/1',
    companyLogoUrl: '',
    companyName: 'Acme Corp',
    requiredSkills: [],
    workplaceType: 'remote',
    employmentType: 'permanent',
    isUnwantedCompany: false,
    origin: 'jj',
    ...overrides,
  }
}

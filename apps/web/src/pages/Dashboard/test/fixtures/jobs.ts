import { type JobAdApplication, type JobAdMeta, type JobAdWithMeta, emptyJobAdMeta } from '@repo/types'

type JobAdOverrides = Partial<Omit<JobAdWithMeta, 'meta'>> &
  Pick<JobAdWithMeta, 'id' | 'title'> & {
    meta?: Partial<Omit<JobAdMeta, 'application'>> & {
      application?: Partial<JobAdApplication>
    }
  }

export function jobAd(overrides: JobAdOverrides): JobAdWithMeta {
  const { meta, ...rest } = overrides

  return {
    advertUrl: 'https://example.com/job/1',
    companyLogoUrl: '',
    companyName: 'Acme Corp',
    requiredSkills: [],
    workplaceType: 'remote',
    employmentType: 'permanent',
    origin: 'jj',
    ...rest,
    meta: {
      ...emptyJobAdMeta(),
      ...meta,
      application: {
        ...emptyJobAdMeta().application,
        ...meta?.application,
      },
    },
  }
}

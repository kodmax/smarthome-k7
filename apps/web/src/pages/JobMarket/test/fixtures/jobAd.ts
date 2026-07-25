import {
  type JobAdApplication,
  type JobAdMatchAnalysis,
  type JobAdMeta,
  type JobAdWithMeta,
  emptyJobAdMeta,
} from '@repo/types'

type JobAdOverrides = Partial<Omit<JobAdWithMeta, 'meta'>> &
  Pick<JobAdWithMeta, 'id' | 'title'> & {
    meta?: Partial<Omit<JobAdMeta, 'application'>> & {
      application?: Partial<JobAdApplication>
    }
  }

export function matchAnalysis(
  overrides: Partial<JobAdMatchAnalysis> & Pick<JobAdMatchAnalysis, 'analyzedAt'>,
): JobAdMatchAnalysis {
  return {
    score: 4,
    summary: 'Dobre dopasowanie.',
    strengths: 'React, TypeScript.',
    gaps: 'Brak doświadczenia w GraphQL.',
    observations: 'CV jest przejrzyste.',
    conclusion: 'Warto rozważyć rozmowę.',
    ...overrides,
  }
}

export function jobAd(overrides: JobAdOverrides): JobAdWithMeta {
  const { meta, matchAnalysis = null, ...rest } = overrides

  return {
    advertUrl: 'https://example.com/job/1',
    companyLogoUrl: '',
    companyName: 'Acme Corp',
    requiredSkills: [],
    workplaceType: 'remote',
    employmentType: 'permanent',
    origin: 'jj',
    publishedAt: '2026-01-01T00:00:00.000Z',
    matchAnalysis,
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

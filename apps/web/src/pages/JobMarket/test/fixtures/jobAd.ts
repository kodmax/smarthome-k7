import {
  type JobAdApplication,
  type JobAdMatchAnalysis,
  type JobAdMeta,
  type JobAdsFeedItem,
  emptyJobAdMeta,
} from '@repo/types'

type JobAdOverrides = Partial<Omit<JobAdsFeedItem['content'], 'id' | 'title'>> &
  Pick<JobAdsFeedItem['content'], 'id' | 'title'> & {
    meta?: Partial<Omit<JobAdMeta, 'application'>> & {
      application?: Partial<JobAdApplication>
    }
    matchAnalysis?: JobAdMatchAnalysis | null
  }

export function matchAnalysis(
  overrides: Partial<JobAdMatchAnalysis> & Pick<JobAdMatchAnalysis, 'analyzedAt'>,
): JobAdMatchAnalysis {
  return {
    score: 80,
    summary: 'Dobre dopasowanie.',
    strengths: 'React, TypeScript.',
    gaps: 'Brak doświadczenia w GraphQL.',
    observations: 'CV jest przejrzyste.',
    conclusion: 'Warto rozważyć rozmowę.',
    ...overrides,
  }
}

export function jobAd(overrides: JobAdOverrides): JobAdsFeedItem {
  const { meta, matchAnalysis = null, id, title, ...restAd } = overrides

  return {
    content: {
      advertUrl: 'https://example.com/job/1',
      companyLogoUrl: '',
      companyName: 'Acme Corp',
      requiredSkills: [],
      workplaceType: 'remote',
      employmentType: 'permanent',
      origin: 'jj',
      publishedAt: '2026-01-01T00:00:00.000Z',
      id,
      title,
      ...restAd,
    },
    matchAnalysis,
    meta: {
      ...emptyJobAdMeta(),
      ...(matchAnalysis !== null ? { isCurrentCVUsed: true } : {}),
      ...meta,
      application: {
        ...emptyJobAdMeta().application,
        ...meta?.application,
      },
    },
  }
}

import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { computePopularTechnologies } from './computePopularTechnologies'

const makeAd = (requiredSkills: string[], salary?: { from: number; to: number }): JobAd => ({
  id: `${requiredSkills.join('-')}-${salary?.from ?? 'none'}`,
  origin: 'jj',
  title: 'Developer',
  advertUrl: 'https://example.com',
  companyLogoUrl: 'https://example.com/logo.png',
  companyName: 'Acme',
  requiredSkills,
  workplaceType: 'remote',
  employmentType: 'permanent',
  publishedAt: '2026-01-01T00:00:00.000Z',
  monthlySalaryRangeAfterTaxes: salary,
})

describe('computePopularTechnologies', () => {
  it('returns an empty list when there are no ads', () => {
    expect(computePopularTechnologies([])).toEqual([])
  })

  it('counts offers, share and median salary per tracked technology', () => {
    expect(
      computePopularTechnologies([
        makeAd(['JavaScript', 'React'], { from: 20_000, to: 24_000 }),
        makeAd(['JavaScript', 'TypeScript'], { from: 28_000, to: 32_000 }),
        makeAd(['Node.js'], { from: 26_000, to: 30_000 }),
        makeAd(['Python']),
      ]),
    ).toEqual([
      {
        id: 'javascript',
        name: 'JavaScript',
        offersCount: 2,
        sharePercent: 50,
        medianSalary: 28_000,
      },
      {
        id: 'node',
        name: 'Node.js',
        offersCount: 1,
        sharePercent: 25,
        medianSalary: 30_000,
      },
      {
        id: 'react',
        name: 'React',
        offersCount: 1,
        sharePercent: 25,
        medianSalary: 24_000,
      },
      {
        id: 'typescript',
        name: 'TypeScript',
        offersCount: 1,
        sharePercent: 25,
        medianSalary: 32_000,
      },
      {
        id: 'aws',
        name: 'AWS',
        offersCount: 0,
        sharePercent: 0,
        medianSalary: null,
      },
      {
        id: 'docker',
        name: 'Docker',
        offersCount: 0,
        sharePercent: 0,
        medianSalary: null,
      },
      {
        id: 'git',
        name: 'Git',
        offersCount: 0,
        sharePercent: 0,
        medianSalary: null,
      },
      {
        id: 'graphql',
        name: 'GraphQL',
        offersCount: 0,
        sharePercent: 0,
        medianSalary: null,
      },
      {
        id: 'next',
        name: 'Next.js',
        offersCount: 0,
        sharePercent: 0,
        medianSalary: null,
      },
      {
        id: 'postgresql',
        name: 'PostgreSQL',
        offersCount: 0,
        sharePercent: 0,
        medianSalary: null,
      },
    ])
  })
})

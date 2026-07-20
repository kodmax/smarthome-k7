import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { computePopularTechnologies, toTechnologyId } from './computePopularTechnologies'

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

describe('toTechnologyId', () => {
  it('slugifies skill names', () => {
    expect(toTechnologyId('Node.js')).toBe('node-js')
    expect(toTechnologyId('C++')).toBe('c')
  })
})

describe('computePopularTechnologies', () => {
  it('returns an empty list when there are no ads', () => {
    expect(computePopularTechnologies([])).toEqual([])
  })

  it('counts offers, share and median salary per unified skill', () => {
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
        id: 'node-js',
        name: 'Node.js',
        offersCount: 1,
        sharePercent: 25,
        medianSalary: 30_000,
      },
      {
        id: 'python',
        name: 'Python',
        offersCount: 1,
        sharePercent: 25,
        medianSalary: null,
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
    ])
  })

  it('unifies fragmented skill names and counts an ad once per skill group', () => {
    expect(
      computePopularTechnologies([
        makeAd(['React', 'React.js', 'ReactJS'], { from: 20_000, to: 24_000 }),
        makeAd(['ReactJS'], { from: 28_000, to: 32_000 }),
      ]),
    ).toEqual([
      {
        id: 'react',
        name: 'React',
        offersCount: 2,
        sharePercent: 100,
        medianSalary: 28_000,
      },
    ])
  })
})

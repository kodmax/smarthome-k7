import { describe, expect, it } from 'vitest'
import { Ad } from './types'
import { normalizeTheprotocolSalaryBounds, toJobAd } from './toJobAd'

const bayerLikeAd = (): Ad =>
  ({
    id: '01000000-2f63-e892-7e9a-08def6b65c58',
    groupId: 'group-id',
    title: 'Senior Software Engineer',
    employer: 'Digital Hub Warsaw at Bayer',
    employerId: '1',
    logoUrl: 'https://example.com/logo.png',
    offerUrlName:
      'senior-software-engineer-warszawa-aleje-jerozolimskie-158,oferta,01000000-2f63-e892-7e9a-08def6b65c58',
    aboutProject: ['desc'],
    workplace: [{ location: 'Warszawa', city: 'Warszawa', region: 'Masovian' }],
    positionLevels: [{ value: 'senior' }],
    typesOfContracts: [
      {
        id: 1,
        salary: {
          from: 20_240,
          to: 0,
          currencySymbol: 'zł',
          timeUnitId: 0,
          timeUnit: { shortForm: 'mth.', longForm: 'monthly' },
          kindName: 'brutto',
        },
      },
    ],
    workModes: ['hybrid'],
    technologies: ['Python', 'TypeScript'],
    new: false,
    publicationDateUtc: '2026-08-10T00:00:00.000Z',
    lastCall: false,
    language: 'en',
    salary: {
      to: 20_240,
      currency: 'zł',
      timeUnit: { shortForm: 'mth.', longForm: 'monthly' },
    },
    immediateEmployment: true,
    isSupportingUkraine: false,
    addons: { searchableLocations: [], searchableRegions: [], isWholePoland: false },
    isFromExternalLocations: false,
    badges: {
      new: false,
      lastCall: false,
      immediateEmployment: true,
      isSupportingUkraine: false,
      isFromExternalLocations: false,
      isQuickApply: false,
    },
    alpha: null,
  }) as Ad

describe('normalizeTheprotocolSalaryBounds', () => {
  it('uses from as to when upper bound is zero', () => {
    expect(normalizeTheprotocolSalaryBounds(20_240, 0)).toEqual({ from: 20_240, to: 20_240 })
  })

  it('keeps valid ranges unchanged', () => {
    expect(normalizeTheprotocolSalaryBounds(10_000, 15_000)).toEqual({ from: 10_000, to: 15_000 })
  })
})

describe('toJobAd', () => {
  it('maps minimum-only gross permanent salary to a non-zero monthly net range', () => {
    const jobAd = toJobAd(bayerLikeAd())

    expect(jobAd).not.toBeNull()
    expect(jobAd?.monthlySalaryRangeAfterTaxes).toEqual({ from: 12_144, to: 12_144 })
    expect(jobAd?.employmentType).toBe('permanent')
  })
})

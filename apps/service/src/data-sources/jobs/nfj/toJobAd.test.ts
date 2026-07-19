import { describe, expect, it } from 'vitest'
import { digestNfjId } from './digestNfjId'
import { toJobAd } from './toJobAd'
import { NoFluffJobsAd } from './types'

const baseNfjAd: NoFluffJobsAd = {
  id: 'nfj-123',
  title: 'Senior React Developer',
  url: 'senior-react-developer-acme',
  name: 'Acme',
  logo: { original: 'logos/acme.png' },
  location: { fullyRemote: false },
  salary: { from: 30_000, to: 40_000, type: 'permanent' },
  tiles: {
    values: [
      { type: 'requirement', value: 'React' },
      { type: 'requirement', value: 'TypeScript' },
      { type: 'category', value: 'JavaScript' },
    ],
  },
}

describe('toJobAd', () => {
  it('converts a standard NFJ ad to JobAd', () => {
    expect(toJobAd(baseNfjAd, new Set())).toEqual({
      id: digestNfjId('nfj-123'),
      origin: 'nfj',
      title: 'Senior React Developer',
      advertUrl: 'https://nofluffjobs.com/pl/job/senior-react-developer-acme',
      companyLogoUrl: 'https://static.nofluffjobs.com/logos/acme.png',
      companyName: 'Acme',
      requiredSkills: ['React', 'TypeScript'],
      workplaceType: 'office',
      employmentType: 'permanent',
      applied: false,
      hide: false,
      fav: false,
      monthlySalaryRangeAfterTaxes: { from: 18_000, to: 24_000 },
    })
  })

  it('marks hybrid when id is in hybridIds', () => {
    expect(toJobAd(baseNfjAd, new Set(['nfj-123'])).workplaceType).toBe('hybrid')
  })

  it('marks remote when fullyRemote and not hybrid', () => {
    expect(toJobAd({ ...baseNfjAd, location: { fullyRemote: true } }, new Set()).workplaceType).toBe('remote')
  })

  it('omits salary when range is incomplete', () => {
    expect(toJobAd({ ...baseNfjAd, salary: { type: 'permanent' } }, new Set()).monthlySalaryRangeAfterTaxes).toBe(
      undefined,
    )
  })

  it('calculates B2B salary', () => {
    const ad = toJobAd(
      {
        ...baseNfjAd,
        salary: { from: 20_000, to: 25_000, type: 'b2b' },
      },
      new Set(),
    )

    expect(ad.employmentType).toBe('b2b')
    expect(ad.monthlySalaryRangeAfterTaxes).toEqual({
      from: Math.round((((20_000 * 12) / 2008) * 1800 * 0.88 - 12_000) / 12),
      to: Math.round((((25_000 * 12) / 2008) * 1800 * 0.88 - 12_000) / 12),
    })
  })
})

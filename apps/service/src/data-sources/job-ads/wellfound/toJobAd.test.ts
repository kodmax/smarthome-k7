import { describe, expect, it } from 'vitest'
import { digestWellfoundId } from './digestWellfoundId'
import { toJobAd } from './toJobAd'
import type { WellfoundListing } from './types'

const sampleListing = (): WellfoundListing => ({
  companyName: 'Acme Remote',
  companyLogoUrl: 'https://example.com/logo.png',
  job: {
    __typename: 'JobListingSearchResult',
    id: '123456',
    slug: 'senior-engineer',
    title: 'Senior Engineer',
    compensation: '$120k – $160k',
    remote: true,
    remoteConfig: { __typename: 'JobListingRemoteConfig', kind: 'REMOTE', wfhFlexible: true },
    acceptedRemoteLocationNames: [],
    liveStartAt: Math.floor(Date.now() / 1_000) - 86_400,
  },
})

describe('toJobAd', () => {
  it('maps listing with originalSalary', () => {
    const jobAd = toJobAd(sampleListing())
    expect(jobAd).toEqual({
      id: digestWellfoundId('123456'),
      title: 'Senior Engineer',
      advertUrl: 'https://wellfound.com/jobs/123456-senior-engineer',
      companyLogoUrl: 'https://example.com/logo.png',
      companyName: 'Acme Remote',
      requiredSkills: [],
      workplaceType: 'remote',
      employmentType: 'b2b',
      originalSalary: {
        from: 120_000,
        to: 160_000,
        period: 'Year',
        currency: 'USD',
      },
      origin: 'wellfound',
      publishedAt: expect.any(String),
    })
  })

  it('returns null when compensation is unsupported', () => {
    expect(
      toJobAd({
        ...sampleListing(),
        job: { ...sampleListing().job, compensation: '0.1% – 0.5%' },
      }),
    ).toBeNull()
  })

  it('returns null when liveStartAt is missing', () => {
    expect(
      toJobAd({
        ...sampleListing(),
        job: { ...sampleListing().job, liveStartAt: null },
      }),
    ).toBeNull()
  })
})

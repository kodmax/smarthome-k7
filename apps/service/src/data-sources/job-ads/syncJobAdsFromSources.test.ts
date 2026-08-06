import { JobAd } from '@repo/types'
import type { Sql } from '@repo/db'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createJobAdDocument } from './jobAdDocument'
import * as jobAdsRepository from './jobAdsRepository'
import { syncJobAdsFromSources } from './syncJobAdsFromSources'
import * as jjitFetch from './jjit/fetchJustJoinAds'
import * as nfjFetch from './nfj/nfj'
import * as theprotocolFetch from './theprotocol/theprotocol'
import { digestJjitId } from './jjit/digestJjitId'
import { NoFluffJobsAd } from './nfj/types'
import { Ad } from './theprotocol/types'

vi.mock('./jjit/fetchJustJoinAds')
vi.mock('./nfj/nfj')
vi.mock('./theprotocol/theprotocol')

const sampleJjAd = (): JustJoinAd => ({
  title: 'React Dev',
  guid: 'guid',
  slug: 'react-dev-acme',
  city: 'Warszawa',
  requiredSkills: [{ name: 'React', level: 3 }],
  employmentTypes: [
    {
      from: 10000,
      fromPerUnit: 10000,
      to: 15000,
      toPerUnit: 15000,
      currency: 'PLN',
      currencySource: 'original',
      type: 'b2b',
      unit: 'Month',
      gross: false,
    },
  ],
  street: '',
  companyLogoThumbUrl: '',
  companyName: 'Acme',
  experienceLevel: 'mid',
  workplaceType: 'remote',
  niceToHaveSkills: [],
  publishedAt: '2026-01-01T00:00:00.000Z',
  lastPublishedAt: '2026-01-01T00:00:00.000Z',
  expiredAt: '2026-12-31T00:00:00.000Z',
})

const sampleNfjAd = (): NoFluffJobsAd => ({
  id: 'nfj-id',
  title: 'Vue Dev',
  url: 'vue-dev-other',
  name: 'Other',
  logo: { original: 'logo.png' },
  location: { fullyRemote: true },
  salary: { from: 10000, to: 15000, type: 'b2b' },
  tiles: { values: [{ value: 'Vue', type: 'requirement' }] },
  posted: Date.parse('2026-01-01T00:00:00.000Z'),
})

const sampleTpAd = (): Ad =>
  ({
    id: '47a40000-59d6-3231-434e-08dec78793b9',
    groupId: '9c7de7ae-6365-f111-8fcb-6045bdf5bd72',
    title: 'Next Dev',
    employer: 'Third Co',
    employerId: '1',
    logoUrl: '',
    offerUrlName: 'next-dev-warszawa',
    aboutProject: ['desc'],
    workplace: [{ location: 'Warszawa', city: 'Warszawa', region: 'Masovian' }],
    positionLevels: [{ value: 'senior' }],
    typesOfContracts: [
      {
        id: 3,
        salary: {
          from: 10000,
          to: 15000,
          currencySymbol: 'zł',
          timeUnitId: 0,
          timeUnit: { shortForm: 'mth.', longForm: 'monthly' },
          kindName: 'netto (+ VAT)',
        },
      },
    ],
    workModes: ['remote'],
    technologies: ['Next.js'],
    new: false,
    publicationDateUtc: '2026-01-01T00:00:00.000Z',
    lastCall: false,
    language: 'en',
    salary: {
      to: 15000,
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

describe('syncJobAdsFromSources', () => {
  const db = {} as Sql

  beforeEach(() => {
    vi.restoreAllMocks()
    vi.spyOn(jjitFetch, 'fetchJustJoinAds').mockResolvedValue([sampleJjAd()])
    vi.spyOn(nfjFetch, 'fetchNfjListing').mockResolvedValue({ postings: [sampleNfjAd()], hybridIds: new Set() })
    vi.spyOn(theprotocolFetch, 'fetchTheprotocolOffers').mockResolvedValue([sampleTpAd()])
  })

  it('inserts new ads and returns listing ids', async () => {
    vi.spyOn(jobAdsRepository, 'loadExistingJobAdIds').mockResolvedValue(new Set())
    const batchUpdateLastSeen = vi.spyOn(jobAdsRepository, 'batchUpdateLastSeen').mockResolvedValue(undefined)
    const batchInsertJobAds = vi.spyOn(jobAdsRepository, 'batchInsertJobAds').mockResolvedValue(undefined)

    const result = await syncJobAdsFromSources(db)

    expect(result.listingIds).toHaveLength(3)
    expect(batchUpdateLastSeen).not.toHaveBeenCalled()
    expect(batchInsertJobAds).toHaveBeenCalledTimes(1)
    expect(batchInsertJobAds.mock.calls[0]?.[1]).toHaveLength(3)
  })

  it('updates last_seen for existing ads without inserting', async () => {
    const existingId = digestJjitId('react-dev-acme')
    vi.spyOn(jjitFetch, 'fetchJustJoinAds').mockResolvedValue([{ ...sampleJjAd(), slug: 'react-dev-acme' }])
    vi.spyOn(nfjFetch, 'fetchNfjListing').mockResolvedValue({ postings: [], hybridIds: new Set() })
    vi.spyOn(theprotocolFetch, 'fetchTheprotocolOffers').mockResolvedValue([])

    vi.spyOn(jobAdsRepository, 'loadExistingJobAdIds').mockResolvedValue(new Set([existingId]))
    const batchUpdateLastSeen = vi.spyOn(jobAdsRepository, 'batchUpdateLastSeen').mockResolvedValue(undefined)
    const batchInsertJobAds = vi.spyOn(jobAdsRepository, 'batchInsertJobAds').mockResolvedValue(undefined)

    const result = await syncJobAdsFromSources(db)

    expect(result.listingIds).toEqual([existingId])
    expect(batchUpdateLastSeen).toHaveBeenCalledWith(db, [existingId])
    expect(batchInsertJobAds).not.toHaveBeenCalled()
  })

  it('stores all portal entries with the same company and title', async () => {
    const duplicateNfj = { ...sampleNfjAd(), url: 'different-url-same-title', name: 'Acme', title: 'React Dev' }
    vi.spyOn(nfjFetch, 'fetchNfjListing').mockResolvedValue({ postings: [duplicateNfj], hybridIds: new Set() })
    vi.spyOn(theprotocolFetch, 'fetchTheprotocolOffers').mockResolvedValue([])

    vi.spyOn(jobAdsRepository, 'loadExistingJobAdIds').mockResolvedValue(new Set())
    vi.spyOn(jobAdsRepository, 'batchUpdateLastSeen').mockResolvedValue(undefined)
    const batchInsertJobAds = vi.spyOn(jobAdsRepository, 'batchInsertJobAds').mockResolvedValue(undefined)

    const result = await syncJobAdsFromSources(db)

    expect(result.listingIds).toHaveLength(2)
    expect(batchInsertJobAds.mock.calls[0]?.[1]).toHaveLength(2)
  })
})

describe('createJobAdDocument integration', () => {
  it('builds insert payload for job ad content', () => {
    const content: JobAd = {
      id: 'abc',
      title: 'Dev',
      advertUrl: 'https://example.com',
      companyLogoUrl: '',
      companyName: 'Acme',
      requiredSkills: [],
      workplaceType: 'remote',
      employmentType: 'b2b',
      origin: 'jj',
      publishedAt: '2026-01-01T00:00:00.000Z',
    }

    expect(createJobAdDocument(content).meta.firstPublishedAt).toBe(content.publishedAt)
  })
})

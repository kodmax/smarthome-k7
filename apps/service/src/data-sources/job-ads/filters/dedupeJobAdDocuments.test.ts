import { JobAd, JobAdDocument } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { createJobAdDocument } from '../jobAdDocument'
import { dedupeJobAdDocuments } from './dedupeJobAdDocuments'

const sampleDocument = (overrides: Partial<JobAd> & Pick<JobAd, 'id' | 'title' | 'companyName'>): JobAdDocument =>
  createJobAdDocument({
    advertUrl: 'https://example.com',
    companyLogoUrl: '',
    requiredSkills: [],
    workplaceType: 'remote',
    employmentType: 'b2b',
    origin: 'jj',
    publishedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  })

describe('dedupeJobAdDocuments', () => {
  it('deduplicates by company name and title (case-insensitive)', () => {
    const first = sampleDocument({ id: 'jj-id', companyName: 'Acme', title: 'React Dev' })
    const duplicate = sampleDocument({ id: 'nfj-id', companyName: 'ACME', title: 'react dev' })

    expect(dedupeJobAdDocuments([first, duplicate])).toEqual([first])
  })

  it('keeps first source when duplicates appear later in listing order', () => {
    const jj = sampleDocument({ id: 'jj-id', companyName: 'Acme', title: 'React Dev' })
    const nfj = sampleDocument({ id: 'nfj-id', companyName: 'Acme', title: 'React Dev' })

    expect(dedupeJobAdDocuments([jj, nfj])).toEqual([jj])
  })
})

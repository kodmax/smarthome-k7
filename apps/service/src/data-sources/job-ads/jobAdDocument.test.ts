import { JobAd } from '@repo/types'
import { describe, expect, it } from 'vitest'
import { createJobAdDocument, parseJobAdDocument } from './jobAdDocument'

const sampleJobAd = (overrides: Partial<JobAd> & Pick<JobAd, 'id'>): JobAd => ({
  title: 'Frontend Engineer',
  advertUrl: 'https://example.com/job/1',
  companyLogoUrl: '',
  companyName: 'Acme Corp',
  requiredSkills: [],
  workplaceType: 'remote',
  employmentType: 'permanent',
  origin: 'jj',
  publishedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

describe('jobAdDocument', () => {
  it('creates default stored meta from content', () => {
    const content = sampleJobAd({ id: 'abc', publishedAt: '2026-01-02T00:00:00.000Z' })
    const document = createJobAdDocument(content)

    expect(document.meta.firstPublishedAt).toBe('2026-01-02T00:00:00.000Z')
    expect(document.meta.fav).toBe(false)
    expect(document.meta.application.applyStatus).toBe('pending-review')
    expect(document.meta.application.statusChangedAt).toBeNull()
  })

  it('parses stored documents', () => {
    const document = createJobAdDocument(sampleJobAd({ id: 'abc' }))
    expect(parseJobAdDocument(document)).toEqual(document)
  })
})

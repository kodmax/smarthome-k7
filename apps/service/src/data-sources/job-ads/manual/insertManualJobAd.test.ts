import { describe, expect, it } from 'vitest'
import { createJobAdDocument } from '../jobAdDocument'
import { insertManualJobAd } from '../jobAdsRepository'
import { mockSql } from '@/test/mockSql'

const sampleDocument = createJobAdDocument({
  id: 'manual-1',
  title: 'Backend Engineer',
  advertUrl: 'https://example.com/jobs/1',
  companyLogoUrl: '',
  companyName: 'Acme',
  requiredSkills: [],
  workplaceType: 'remote',
  employmentType: 'b2b',
  origin: 'manual',
  publishedAt: '2026-08-06T12:00:00.000Z',
})

describe('insertManualJobAd', () => {
  it('returns false without inserting when id already exists', async () => {
    const db = mockSql([{ id: 'manual-1' }])

    const inserted = await insertManualJobAd(db, sampleDocument)

    expect(inserted).toBe(false)
    expect(db).toHaveBeenCalledTimes(2)
  })

  it('inserts when id does not exist', async () => {
    const db = mockSql([], [])

    const inserted = await insertManualJobAd(db, sampleDocument)

    expect(inserted).toBe(true)
    expect(db).toHaveBeenCalledTimes(3)
  })
})

import { describe, expect, it, vi } from 'vitest'
import { createJobAdDocument } from '../jobAdDocument'
import { insertManualJobAd } from '../jobAdsRepository'

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
    const query = vi.fn().mockResolvedValueOnce([{ id: 'manual-1' }])
    const db = { query } as never

    const inserted = await insertManualJobAd(db, sampleDocument)

    expect(inserted).toBe(false)
    expect(query).toHaveBeenCalledTimes(1)
    expect(query).toHaveBeenCalledWith('select id from job_ads where id in (?)', [[sampleDocument.content.id]])
  })

  it('inserts when id does not exist', async () => {
    const query = vi.fn().mockResolvedValueOnce([]).mockResolvedValueOnce(undefined)
    const db = { query } as never

    const inserted = await insertManualJobAd(db, sampleDocument)

    expect(inserted).toBe(true)
    expect(query).toHaveBeenCalledTimes(2)
    expect(query).toHaveBeenLastCalledWith(
      'insert into job_ads (id, added_at, last_seen, data) values (?, current_timestamp(), current_timestamp(), ?)',
      [sampleDocument.content.id, sampleDocument],
    )
  })
})

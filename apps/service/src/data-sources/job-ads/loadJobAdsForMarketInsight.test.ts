import { describe, expect, it } from 'vitest'
import { createJobAdDocument } from './jobAdDocument'
import { loadJobAdsForMarketInsight } from './loadJobAdsForMarketInsight'
import { mockSql } from '@/test/mockSql'

const manualDocument = createJobAdDocument({
  id: 'manual-1',
  title: 'Backend Engineer',
  advertUrl: 'https://example.com/jobs/1',
  companyLogoUrl: '',
  companyName: 'Acme',
  requiredSkills: ['TypeScript'],
  workplaceType: 'office',
  employmentType: 'permanent',
  origin: 'manual',
  publishedAt: '2026-08-06T12:00:00.000Z',
})

const activePortalDocument = createJobAdDocument({
  id: 'jj-1',
  title: 'Portal Role',
  advertUrl: 'https://example.com/jobs/2',
  companyLogoUrl: '',
  companyName: 'Portal Co',
  requiredSkills: ['React'],
  workplaceType: 'office',
  employmentType: 'permanent',
  origin: 'jj',
  publishedAt: '2026-08-06T12:00:00.000Z',
})

describe('loadJobAdsForMarketInsight', () => {
  it('maps valid rows to JobAd content', async () => {
    const db = mockSql([
      { id: 'manual-1', data: manualDocument },
      { id: 'jj-1', data: activePortalDocument },
    ])

    const ads = await loadJobAdsForMarketInsight(db)

    expect(ads).toHaveLength(2)
    expect(ads.map(ad => ad.id)).toEqual(['manual-1', 'jj-1'])
    expect(db).toHaveBeenCalledOnce()
  })

  it('drops rows with invalid document shape', async () => {
    const db = mockSql([{ id: 'broken-1', data: { content: { title: 'Missing id' } } }])

    expect(await loadJobAdsForMarketInsight(db)).toEqual([])
  })
})

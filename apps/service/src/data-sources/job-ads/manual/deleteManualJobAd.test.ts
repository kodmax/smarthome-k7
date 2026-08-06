import { describe, expect, it } from 'vitest'
import { createJobAdDocument } from '../jobAdDocument'
import { deleteManualJobAd, updateManualJobAd } from '../jobAdsRepository'
import { mockDeleteResult, mockSql } from '@/test/mockSql'

const manualDocument = createJobAdDocument({
  id: 'manual-1',
  title: 'Backend Engineer',
  advertUrl: 'https://example.com/jobs/1',
  companyLogoUrl: '',
  companyName: 'Acme',
  requiredSkills: [],
  workplaceType: 'office',
  employmentType: 'permanent',
  origin: 'manual',
  publishedAt: '2026-08-06T12:00:00.000Z',
})

const portalDocument = createJobAdDocument({
  id: 'jj-1',
  title: 'Portal Role',
  advertUrl: 'https://example.com/jobs/2',
  companyLogoUrl: '',
  companyName: 'Portal Co',
  requiredSkills: [],
  workplaceType: 'office',
  employmentType: 'permanent',
  origin: 'jj',
  publishedAt: '2026-08-06T12:00:00.000Z',
})

describe('updateManualJobAd', () => {
  it('updates manual document', async () => {
    const db = mockSql([{ id: 'manual-1', data: manualDocument }], [])

    const updated = await updateManualJobAd(db, {
      ...manualDocument,
      content: { ...manualDocument.content, workplaceType: 'remote' },
    })

    expect(updated).toBe(true)
    expect(db).toHaveBeenCalledTimes(3)
  })

  it('returns false for portal origin', async () => {
    const db = mockSql()

    expect(await updateManualJobAd(db, portalDocument)).toBe(false)
    expect(db).not.toHaveBeenCalled()
  })
})

describe('deleteManualJobAd', () => {
  it('deletes manual ad within 24h window', async () => {
    const db = mockSql([{ id: 'manual-1', data: manualDocument }], mockDeleteResult(1), mockDeleteResult(1))

    expect(await deleteManualJobAd(db, 'manual-1')).toBe(true)
    expect(db).toHaveBeenCalledTimes(4)
  })

  it('returns false when delete window expired', async () => {
    const db = mockSql([{ id: 'manual-1', data: manualDocument }], mockDeleteResult(0))

    expect(await deleteManualJobAd(db, 'manual-1')).toBe(false)
    expect(db).toHaveBeenCalledTimes(3)
  })

  it('returns false for portal origin', async () => {
    const db = mockSql([{ id: 'jj-1', data: portalDocument }])

    expect(await deleteManualJobAd(db, 'jj-1')).toBe(false)
    expect(db).toHaveBeenCalledTimes(2)
  })
})

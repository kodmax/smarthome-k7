import { describe, expect, it, vi } from 'vitest'
import { createJobAdDocument } from '../jobAdDocument'
import { deleteManualJobAd, updateManualJobAd } from '../jobAdsRepository'

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
    const query = vi
      .fn()
      .mockResolvedValueOnce([{ id: 'manual-1', data: manualDocument }])
      .mockResolvedValueOnce(undefined)
    const db = { query } as never

    const updated = await updateManualJobAd(db, {
      ...manualDocument,
      content: { ...manualDocument.content, workplaceType: 'remote' },
    })

    expect(updated).toBe(true)
    expect(query).toHaveBeenLastCalledWith('update job_ads set data = ? where id = ?', [
      expect.objectContaining({ content: expect.objectContaining({ workplaceType: 'remote' }) }),
      'manual-1',
    ])
  })

  it('returns false for portal origin', async () => {
    const query = vi.fn()
    const db = { query } as never

    expect(await updateManualJobAd(db, portalDocument)).toBe(false)
    expect(query).not.toHaveBeenCalled()
  })
})

describe('deleteManualJobAd', () => {
  it('deletes manual ad within 24h window', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce([{ id: 'manual-1', data: manualDocument }])
      .mockResolvedValueOnce({ affectedRows: 1 })
      .mockResolvedValueOnce(undefined)
    const db = { query } as never

    expect(await deleteManualJobAd(db, 'manual-1')).toBe(true)
    expect(query).toHaveBeenCalledTimes(3)
  })

  it('returns false when delete window expired', async () => {
    const query = vi
      .fn()
      .mockResolvedValueOnce([{ id: 'manual-1', data: manualDocument }])
      .mockResolvedValueOnce({ affectedRows: 0 })
    const db = { query } as never

    expect(await deleteManualJobAd(db, 'manual-1')).toBe(false)
    expect(query).toHaveBeenCalledTimes(2)
  })

  it('returns false for portal origin', async () => {
    const query = vi.fn().mockResolvedValueOnce([{ id: 'jj-1', data: portalDocument }])
    const db = { query } as never

    expect(await deleteManualJobAd(db, 'jj-1')).toBe(false)
    expect(query).toHaveBeenCalledTimes(1)
  })
})

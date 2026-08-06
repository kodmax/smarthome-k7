import { describe, expect, it, vi } from 'vitest'
import { createJobAdDocument } from './jobAdDocument'
import { updateJobAdApplicationMeta } from './jobAdsRepository'
import { mockSql } from '@/test/mockSql'

const document = createJobAdDocument({
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

describe('updateJobAdApplicationMeta', () => {
  it('updates application meta as JSON object, not string', async () => {
    const db = mockSql([{ id: 'manual-1', data: document }], [])
    const application = {
      applyStatus: 'consider' as const,
      archiveReason: null,
      comment: null,
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    }

    await updateJobAdApplicationMeta(db, 'manual-1', application)

    expect(db).toHaveBeenCalledTimes(3)
  })

  it('no-ops when document is missing', async () => {
    const db = mockSql([])

    await updateJobAdApplicationMeta(db, 'missing', {
      applyStatus: 'consider',
      archiveReason: null,
      comment: null,
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    })

    expect(db).toHaveBeenCalledTimes(2)
  })
})

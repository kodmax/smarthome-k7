import { describe, expect, it, vi } from 'vitest'
import { createJobAdDocument } from './jobAdDocument'
import { updateJobAdApplicationMeta } from './jobAdsRepository'

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
    const query = vi
      .fn()
      .mockResolvedValueOnce([{ id: 'manual-1', data: document }])
      .mockResolvedValueOnce(undefined)
    const db = { query } as never
    const application = {
      applyStatus: 'consider' as const,
      archiveReason: null,
      comment: null,
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    }

    await updateJobAdApplicationMeta(db, 'manual-1', application)

    expect(query).toHaveBeenLastCalledWith(
      `update job_ads
       set data = json_set(data, '$.meta.application', json_extract(?, '$'))
       where id = ?`,
      [expect.stringMatching(/"applyStatus":"consider"/), 'manual-1'],
    )
  })

  it('no-ops when document is missing', async () => {
    const query = vi.fn().mockResolvedValueOnce([])
    const db = { query } as never

    await updateJobAdApplicationMeta(db, 'missing', {
      applyStatus: 'consider',
      archiveReason: null,
      comment: null,
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    })

    expect(query).toHaveBeenCalledTimes(1)
  })
})

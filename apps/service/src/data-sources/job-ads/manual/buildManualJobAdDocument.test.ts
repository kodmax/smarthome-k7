import { describe, expect, it } from 'vitest'
import { buildManualJobAdDocument } from './buildManualJobAdDocument'

const now = new Date('2026-08-06T12:00:00.000Z')

describe('buildManualJobAdDocument', () => {
  it('builds manual document with appliedAt default for applied status', () => {
    const document = buildManualJobAdDocument(
      {
        title: 'Backend Engineer',
        companyName: 'Acme',
        advertUrl: 'https://example.com/jobs/1',
        workplaceType: 'remote',
        employmentType: 'permanent',
        applyStatus: 'applied',
        requiredSkills: [],
      },
      now,
    )

    expect(document.content.origin).toBe('manual')
    expect(document.content.companyLogoUrl).toBe('')
    expect(document.content.requiredSkills).toEqual([])
    expect(document.meta.application.appliedAt).toBe(now.toISOString())
    expect(document.meta.application.statusChangedAt).toBe(now.toISOString())
  })

  it('stores required skills on manual document', () => {
    const document = buildManualJobAdDocument(
      {
        title: 'Backend Engineer',
        companyName: 'Acme',
        advertUrl: 'https://example.com/jobs/2',
        workplaceType: 'remote',
        employmentType: 'permanent',
        applyStatus: 'pending-review',
        requiredSkills: ['React', 'TypeScript'],
      },
      now,
    )

    expect(document.content.requiredSkills).toEqual(['React', 'TypeScript'])
  })

  it('clears appliedAt for pending-review', () => {
    const document = buildManualJobAdDocument(
      {
        title: 'Backend Engineer',
        companyName: 'Acme',
        advertUrl: 'https://example.com/jobs/1',
        workplaceType: 'remote',
        employmentType: 'permanent',
        applyStatus: 'pending-review',
        requiredSkills: ['React'],
      },
      now,
    )

    expect(document.meta.application.appliedAt).toBeNull()
    expect(document.meta.application.statusChangedAt).toBeNull()
  })
})

import { describe, expect, it } from 'vitest'
import { createJobAdDocument } from '../jobAdDocument'
import { buildManualJobAdSalary } from './buildManualJobAdSalary'
import { applyManualJobAdContentUpdate } from './applyManualJobAdContentUpdate'

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

describe('applyManualJobAdContentUpdate', () => {
  it('updates only workplace, employment type and salary', () => {
    manualDocument.meta.fav = true
    manualDocument.meta.application.applyStatus = 'applied'

    const updated = applyManualJobAdContentUpdate(manualDocument, {
      id: 'manual-1',
      workplaceType: 'remote',
      employmentType: 'b2b',
      salaryFrom: 20_000,
      salaryTo: 25_000,
    })

    expect(updated.content.title).toBe('Backend Engineer')
    expect(updated.content.companyName).toBe('Acme')
    expect(updated.content.advertUrl).toBe('https://example.com/jobs/1')
    expect(updated.content.workplaceType).toBe('remote')
    expect(updated.content.employmentType).toBe('b2b')
    expect(updated.content.monthlySalaryRangeAfterTaxes).toEqual(buildManualJobAdSalary('b2b', 20_000, 25_000))
    expect(updated.meta.fav).toBe(true)
    expect(updated.meta.application.applyStatus).toBe('applied')
  })
})

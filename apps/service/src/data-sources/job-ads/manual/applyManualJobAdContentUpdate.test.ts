import { describe, expect, it } from 'vitest'
import { createJobAdDocument } from '../jobAdDocument'
import { getMonthlySalaryAfterTax } from '../getMonthlySalaryAfterTax'
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

const portalDocument = createJobAdDocument({
  id: 'jj-1',
  title: 'Portal Role',
  advertUrl: 'https://example.com/jobs/2',
  companyLogoUrl: '',
  companyName: 'Portal Co',
  requiredSkills: [],
  workplaceType: 'office',
  employmentType: 'b2b',
  monthlySalaryRangeAfterTaxes: getMonthlySalaryAfterTax('b2b', 'Month', 30_000, 30_000),
  origin: 'jj',
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
      requiredSkills: ['TypeScript', 'PostgreSQL'],
    })

    expect(updated.content.title).toBe('Backend Engineer')
    expect(updated.content.companyName).toBe('Acme')
    expect(updated.content.advertUrl).toBe('https://example.com/jobs/1')
    expect(updated.content.workplaceType).toBe('remote')
    expect(updated.content.employmentType).toBe('b2b')
    expect(updated.content.monthlySalaryRangeAfterTaxes).toEqual(buildManualJobAdSalary('b2b', 20_000, 25_000))
    expect(updated.content.requiredSkills).toEqual(['TypeScript', 'PostgreSQL'])
    expect(updated.meta.fav).toBe(true)
    expect(updated.meta.application.applyStatus).toBe('applied')
  })

  it('stores paid vacation days and recalculates portal b2b salary', () => {
    const updated = applyManualJobAdContentUpdate(portalDocument, {
      id: 'jj-1',
      workplaceType: 'office',
      employmentType: 'b2b',
      salaryFrom: 30_000,
      salaryTo: 30_000,
      requiredSkills: [],
      paidVacationDays: 20,
    })

    expect(updated.content.origin).toBe('jj')
    expect(updated.content.paidVacationDays).toBe(20)
    expect(updated.content.monthlySalaryRangeAfterTaxes).toEqual(buildManualJobAdSalary('b2b', 30_000, 30_000, 20))
  })

  it('clears paid vacation days when switching to permanent', () => {
    const updated = applyManualJobAdContentUpdate(
      {
        ...portalDocument,
        content: {
          ...portalDocument.content,
          paidVacationDays: 20,
        },
      },
      {
        id: 'jj-1',
        workplaceType: 'office',
        employmentType: 'permanent',
        salaryFrom: 30_000,
        salaryTo: 35_000,
        requiredSkills: [],
        paidVacationDays: 20,
      },
    )

    expect(updated.content.paidVacationDays).toBeUndefined()
  })
})

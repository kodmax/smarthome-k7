import { describe, expect, it } from 'vitest'
import { buildManualJobAdDocument, parseAddManualJobAdArgs } from './parseAddManualJobAdArgs'

const now = new Date('2026-08-06T12:00:00.000Z')

describe('parseAddManualJobAdArgs', () => {
  it('parses valid payload', () => {
    expect(
      parseAddManualJobAdArgs(
        JSON.stringify({
          title: 'Backend Engineer',
          companyName: 'Acme',
          advertUrl: 'https://example.com/jobs/1',
          workplaceType: 'remote',
          employmentType: 'b2b',
          salaryFrom: 20_000,
          salaryTo: 25_000,
          applyStatus: 'applied',
          appliedAt: '2026-08-01T00:00:00.000Z',
        }),
      ),
    ).toEqual({
      title: 'Backend Engineer',
      companyName: 'Acme',
      advertUrl: 'https://example.com/jobs/1',
      workplaceType: 'remote',
      employmentType: 'b2b',
      salaryFrom: 20_000,
      salaryTo: 25_000,
      applyStatus: 'applied',
      appliedAt: '2026-08-01T00:00:00.000Z',
    })
  })

  it('rejects invalid URL', () => {
    expect(
      parseAddManualJobAdArgs(
        JSON.stringify({
          title: 'Backend Engineer',
          companyName: 'Acme',
          advertUrl: 'not-a-url',
          workplaceType: 'remote',
          employmentType: 'b2b',
          applyStatus: 'consider',
        }),
      ),
    ).toBeNull()
  })

  it('rejects archived status', () => {
    expect(
      parseAddManualJobAdArgs(
        JSON.stringify({
          title: 'Backend Engineer',
          companyName: 'Acme',
          advertUrl: 'https://example.com/jobs/1',
          workplaceType: 'remote',
          employmentType: 'b2b',
          applyStatus: 'archived',
        }),
      ),
    ).toBeNull()
  })

  it('rejects invalid salary range', () => {
    expect(
      parseAddManualJobAdArgs(
        JSON.stringify({
          title: 'Backend Engineer',
          companyName: 'Acme',
          advertUrl: 'https://example.com/jobs/1',
          workplaceType: 'remote',
          employmentType: 'b2b',
          salaryFrom: 30_000,
          salaryTo: 20_000,
          applyStatus: 'consider',
        }),
      ),
    ).toBeNull()
  })
})

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
      },
      now,
    )

    expect(document.content.origin).toBe('manual')
    expect(document.content.companyLogoUrl).toBe('')
    expect(document.content.requiredSkills).toEqual([])
    expect(document.meta.application.appliedAt).toBe(now.toISOString())
    expect(document.meta.application.statusChangedAt).toBe(now.toISOString())
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
      },
      now,
    )

    expect(document.meta.application.appliedAt).toBeNull()
    expect(document.meta.application.statusChangedAt).toBeNull()
  })
})

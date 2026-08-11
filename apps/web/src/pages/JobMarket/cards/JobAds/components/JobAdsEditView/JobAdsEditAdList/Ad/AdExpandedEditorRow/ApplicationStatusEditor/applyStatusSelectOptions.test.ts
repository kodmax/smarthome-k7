import { describe, expect, it } from 'vitest'
import { applyArchiveReasonOptions, applyStatusTargetStatuses } from './applyStatusSelectOptions'

describe('applyStatusTargetStatuses', () => {
  it('returns pre-application statuses and archived from pending-review', () => {
    expect(applyStatusTargetStatuses('pending-review', null)).toEqual(['consider', 'applied', 'archived'])
  })

  it('returns applied follow-up statuses and archived', () => {
    expect(applyStatusTargetStatuses('applied', null)).toEqual(['interview', 'archived'])
  })

  it('returns only archived from interview', () => {
    expect(applyStatusTargetStatuses('interview', null)).toEqual(['archived'])
  })

  it('returns unarchive targets and archived from pre-application archived', () => {
    expect(applyStatusTargetStatuses('archived', 'other')).toEqual(['pending-review', 'consider', 'archived'])
    expect(applyStatusTargetStatuses('archived', 'no-response')).toEqual(['interview', 'archived'])
    expect(applyStatusTargetStatuses('archived', 'rejected')).toEqual(['archived'])
    expect(applyStatusTargetStatuses('archived', 'withdrawn')).toEqual(['archived'])
  })
})

describe('applyArchiveReasonOptions', () => {
  it('returns pre-application archive reasons from pending-review', () => {
    expect(applyArchiveReasonOptions('pending-review')).toEqual([
      'other',
      'unmet-requirements',
      'stack-mismatch',
      'weak-match',
      'manager-track',
      'company-excluded',
    ])
  })

  it('returns post-application archive reasons from applied', () => {
    expect(applyArchiveReasonOptions('applied')).toEqual(['rejected', 'withdrawn', 'no-response'])
  })

  it('returns interview archive reasons including offer-accepted', () => {
    expect(applyArchiveReasonOptions('interview')).toEqual(['rejected', 'withdrawn', 'offer-accepted'])
  })

  it('returns rearchive reasons from archived ads', () => {
    expect(applyArchiveReasonOptions('archived', 'other')).toEqual([
      'unmet-requirements',
      'stack-mismatch',
      'weak-match',
      'manager-track',
      'company-excluded',
      'rejected',
      'withdrawn',
      'no-response',
      'offer-accepted',
    ])
    expect(applyArchiveReasonOptions('archived', 'no-response')).toHaveLength(9)
    expect(applyArchiveReasonOptions('archived', 'rejected')).toHaveLength(9)
    expect(applyArchiveReasonOptions('archived', 'withdrawn')).toHaveLength(9)
  })
})

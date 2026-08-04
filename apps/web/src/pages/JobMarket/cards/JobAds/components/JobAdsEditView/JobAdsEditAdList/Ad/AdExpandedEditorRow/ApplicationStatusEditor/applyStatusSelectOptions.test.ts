import { describe, expect, it } from 'vitest'
import { applyArchiveReasonOptions, applyStatusTargetStatuses } from './applyStatusSelectOptions'

describe('applyStatusTargetStatuses', () => {
  it('returns pre-application statuses and archived from pending-review', () => {
    expect(applyStatusTargetStatuses('pending-review', null)).toEqual(['consider', 'applied', 'archived'])
  })

  it('returns applied follow-up statuses and archived', () => {
    expect(applyStatusTargetStatuses('applied', null)).toEqual(['no-response', 'interview', 'archived'])
  })

  it('returns only archived from interview', () => {
    expect(applyStatusTargetStatuses('interview', null)).toEqual(['archived'])
  })

  it('returns unarchive targets from archived', () => {
    expect(applyStatusTargetStatuses('archived', 'not-interested')).toEqual(['pending-review', 'consider'])
  })
})

describe('applyArchiveReasonOptions', () => {
  it('returns pre-application archive reasons from pending-review', () => {
    expect(applyArchiveReasonOptions('pending-review')).toEqual([
      'not-interested',
      'unmet-requirements',
      'stack-mismatch',
      'weak-match',
    ])
  })

  it('returns post-application archive reasons from applied', () => {
    expect(applyArchiveReasonOptions('applied')).toEqual(['rejected', 'withdrawn'])
  })

  it('returns archive reasons including no-response from no-response status', () => {
    expect(applyArchiveReasonOptions('no-response')).toEqual(['rejected', 'withdrawn', 'no-response'])
  })

  it('returns interview archive reasons including offer-accepted', () => {
    expect(applyArchiveReasonOptions('interview')).toEqual(['rejected', 'withdrawn', 'offer-accepted'])
  })
})

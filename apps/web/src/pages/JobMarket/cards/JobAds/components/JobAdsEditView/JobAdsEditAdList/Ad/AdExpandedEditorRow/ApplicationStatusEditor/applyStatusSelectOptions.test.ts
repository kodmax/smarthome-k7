import { describe, expect, it } from 'vitest'
import { applyStatusTargetOptions } from './applyStatusSelectOptions'

describe('applyStatusTargetOptions', () => {
  it('returns only archived for terminal statuses that can be archived', () => {
    expect(applyStatusTargetOptions('rejected')).toEqual(['archived'])
    expect(applyStatusTargetOptions('stack-mismatch')).toEqual(['archived'])
    expect(applyStatusTargetOptions('offer-accepted')).toEqual(['archived'])
    expect(applyStatusTargetOptions('withdrawn')).toEqual(['archived'])
    expect(applyStatusTargetOptions('archived')).toEqual([])
  })

  it('returns reset transitions from not-interested', () => {
    expect(applyStatusTargetOptions('not-interested')).toEqual([
      'not-applied',
      'applied',
      'unmet-requirements',
      'stack-mismatch',
      'archived',
    ])
  })

  it('returns follow-up transitions from unmet-requirements', () => {
    expect(applyStatusTargetOptions('unmet-requirements')).toEqual([
      'not-applied',
      'applied',
      'stack-mismatch',
      'archived',
    ])
  })

  it('includes consider first, then pre-application targets from not-applied', () => {
    expect(applyStatusTargetOptions('not-applied')).toEqual([
      'consider',
      'applied',
      'not-interested',
      'unmet-requirements',
      'stack-mismatch',
    ])
  })

  it('returns the same follow-up transitions from consider as from not-applied', () => {
    expect(applyStatusTargetOptions('consider')).toEqual([
      'applied',
      'not-interested',
      'unmet-requirements',
      'stack-mismatch',
    ])
  })

  it('returns only allowed transitions', () => {
    expect(applyStatusTargetOptions('applied')).toEqual([
      'rejected',
      'no-response',
      'interview',
      'withdrawn',
      'unmet-requirements',
    ])
  })

  it('returns the same follow-up transitions from no-response as from applied, plus archived', () => {
    expect(applyStatusTargetOptions('no-response')).toEqual([
      'rejected',
      'interview',
      'withdrawn',
      'unmet-requirements',
      'archived',
    ])
  })
})

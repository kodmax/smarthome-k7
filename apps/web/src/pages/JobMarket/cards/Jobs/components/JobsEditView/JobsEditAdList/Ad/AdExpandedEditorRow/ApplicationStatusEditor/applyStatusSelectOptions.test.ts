import { describe, expect, it } from 'vitest'
import { applyStatusTargetOptions } from './applyStatusSelectOptions'

describe('applyStatusTargetOptions', () => {
  it('returns no options for terminal statuses', () => {
    expect(applyStatusTargetOptions('rejected')).toEqual([])
    expect(applyStatusTargetOptions('stack-mismatch')).toEqual([])
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
    expect(applyStatusTargetOptions('unmet-requirements')).toEqual(['not-applied', 'applied', 'stack-mismatch'])
  })

  it('includes unmet-requirements and stack-mismatch from not-applied', () => {
    expect(applyStatusTargetOptions('not-applied')).toEqual([
      'applied',
      'not-interested',
      'unmet-requirements',
      'stack-mismatch',
    ])
  })

  it('returns the same follow-up transitions from no-response as from applied', () => {
    expect(applyStatusTargetOptions('no-response')).toEqual(['rejected', 'no-response', 'interview', 'withdrawn'])
  })

  it('returns only allowed transitions', () => {
    expect(applyStatusTargetOptions('applied')).toEqual(['rejected', 'no-response', 'interview', 'withdrawn'])
  })
})

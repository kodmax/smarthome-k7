import { describe, expect, it } from 'vitest'
import { applyStatusTargetOptions } from './applyStatusSelectOptions'

describe('applyStatusTargetOptions', () => {
  it('returns no options for terminal statuses', () => {
    expect(applyStatusTargetOptions('rejected')).toEqual([])
  })

  it('returns reset transitions from not-interested', () => {
    expect(applyStatusTargetOptions('not-interested')).toEqual(['not-applied', 'applied', 'unmet-requirements'])
  })

  it('returns no transitions from unmet-requirements', () => {
    expect(applyStatusTargetOptions('unmet-requirements')).toEqual([])
  })

  it('includes unmet-requirements from not-applied', () => {
    expect(applyStatusTargetOptions('not-applied')).toEqual(['applied', 'not-interested', 'unmet-requirements'])
  })

  it('returns the same follow-up transitions from no-response as from applied', () => {
    expect(applyStatusTargetOptions('no-response')).toEqual(['rejected', 'no-response', 'interview', 'withdrawn'])
  })

  it('returns only allowed transitions', () => {
    expect(applyStatusTargetOptions('applied')).toEqual(['rejected', 'no-response', 'interview', 'withdrawn'])
  })
})

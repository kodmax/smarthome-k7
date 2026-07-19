import { describe, expect, it } from 'vitest'
import { applyStatusTargetOptions } from './applyStatusSelectOptions'

describe('applyStatusTargetOptions', () => {
  it('returns no options for terminal statuses', () => {
    expect(applyStatusTargetOptions('rejected')).toEqual([])
  })

  it('returns reset transitions from not-interested', () => {
    expect(applyStatusTargetOptions('not-interested')).toEqual(['not-applied', 'applied'])
  })

  it('returns only allowed transitions', () => {
    expect(applyStatusTargetOptions('applied')).toEqual(['rejected', 'no-response', 'interview', 'withdrawn'])
  })
})

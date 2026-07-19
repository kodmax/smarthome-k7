import { describe, expect, it } from 'vitest'
import { applyStatusTargetOptions } from './applyStatusSelectOptions'

describe('applyStatusTargetOptions', () => {
  it('returns no options for terminal statuses', () => {
    expect(applyStatusTargetOptions('rejected')).toEqual([])
  })

  it('returns reset transition from not-interested', () => {
    expect(applyStatusTargetOptions('not-interested')).toEqual(['applied'])
  })

  it('returns only allowed transitions', () => {
    expect(applyStatusTargetOptions('applied')).toEqual(['rejected', 'no-response', 'interview', 'withdrawn'])
  })
})

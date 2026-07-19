import { describe, expect, it } from 'vitest'
import { availableTargetApplyStatuses, canTransition, isTerminalApplyStatus } from './jobApplyStatusFlow'

describe('jobApplyStatusFlow', () => {
  it('allows self-transition for comment-only updates', () => {
    expect(canTransition('applied', 'applied')).toBe(true)
  })

  it('allows not-applied to applied and not-interested', () => {
    expect(canTransition('not-applied', 'applied')).toBe(true)
    expect(canTransition('not-applied', 'not-interested')).toBe(true)
    expect(canTransition('not-applied', 'withdrawn')).toBe(false)
  })

  it('allows not-interested to not-applied and applied', () => {
    expect(canTransition('not-interested', 'not-applied')).toBe(true)
    expect(canTransition('not-interested', 'applied')).toBe(true)
  })

  it('allows applied follow-up statuses', () => {
    expect(availableTargetApplyStatuses('applied')).toEqual(['rejected', 'no-response', 'interview', 'withdrawn'])
  })

  it('allows interview and offer follow-up statuses', () => {
    expect(availableTargetApplyStatuses('interview')).toEqual(['rejected', 'withdrawn', 'offer'])
    expect(availableTargetApplyStatuses('offer')).toEqual(['offer-accepted', 'withdrawn'])
  })

  it('marks terminal statuses', () => {
    expect(isTerminalApplyStatus('rejected')).toBe(true)
    expect(isTerminalApplyStatus('no-response')).toBe(true)
    expect(isTerminalApplyStatus('offer-accepted')).toBe(true)
    expect(isTerminalApplyStatus('withdrawn')).toBe(true)
    expect(isTerminalApplyStatus('applied')).toBe(false)
    expect(isTerminalApplyStatus('not-interested')).toBe(false)
  })

  it('blocks transitions from terminal statuses', () => {
    expect(canTransition('offer-accepted', 'withdrawn')).toBe(false)
    expect(canTransition('rejected', 'applied')).toBe(false)
  })
})

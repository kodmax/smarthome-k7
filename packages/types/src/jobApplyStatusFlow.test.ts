import { describe, expect, it } from 'vitest'
import {
  availableTargetApplyStatuses,
  canTransition,
  HIDDEN_APPLY_STATUS_ORDER,
  isHiddenApplyStatus,
  isTerminalApplyStatus,
  TERMINAL_APPLY_STATUS_ORDER,
} from './jobApplyStatusFlow'

describe('jobApplyStatusFlow', () => {
  it('allows self-transition for comment-only updates', () => {
    expect(canTransition('applied', 'applied')).toBe(true)
  })

  it('allows not-applied to applied, not-interested, unmet-requirements, and stack-mismatch', () => {
    expect(canTransition('not-applied', 'applied')).toBe(true)
    expect(canTransition('not-applied', 'not-interested')).toBe(true)
    expect(canTransition('not-applied', 'unmet-requirements')).toBe(true)
    expect(canTransition('not-applied', 'stack-mismatch')).toBe(true)
    expect(canTransition('not-applied', 'withdrawn')).toBe(false)
  })

  it('allows not-interested to not-applied, applied, unmet-requirements, and stack-mismatch', () => {
    expect(canTransition('not-interested', 'not-applied')).toBe(true)
    expect(canTransition('not-interested', 'applied')).toBe(true)
    expect(canTransition('not-interested', 'unmet-requirements')).toBe(true)
    expect(canTransition('not-interested', 'stack-mismatch')).toBe(true)
  })

  it('allows applied follow-up statuses', () => {
    expect(availableTargetApplyStatuses('applied')).toEqual(['rejected', 'no-response', 'interview', 'withdrawn'])
  })

  it('allows the same follow-up statuses from no-response as from applied', () => {
    expect(availableTargetApplyStatuses('no-response')).toEqual(['rejected', 'no-response', 'interview', 'withdrawn'])
    expect(canTransition('no-response', 'interview')).toBe(true)
    expect(canTransition('no-response', 'rejected')).toBe(true)
  })

  it('allows interview and offer follow-up statuses', () => {
    expect(availableTargetApplyStatuses('interview')).toEqual(['rejected', 'withdrawn', 'offer'])
    expect(availableTargetApplyStatuses('offer')).toEqual(['offer-accepted', 'withdrawn'])
  })

  it('lists terminal statuses in order', () => {
    expect(TERMINAL_APPLY_STATUS_ORDER).toEqual(['rejected', 'offer-accepted', 'withdrawn', 'stack-mismatch'])
    expect(TERMINAL_APPLY_STATUS_ORDER.every(isTerminalApplyStatus)).toBe(true)
    expect(isTerminalApplyStatus('no-response')).toBe(false)
    expect(isTerminalApplyStatus('unmet-requirements')).toBe(false)
  })

  it('lists hidden statuses in order', () => {
    expect(HIDDEN_APPLY_STATUS_ORDER).toEqual([
      'rejected',
      'offer-accepted',
      'withdrawn',
      'stack-mismatch',
      'not-interested',
      'no-response',
      'unmet-requirements',
    ])
    expect(HIDDEN_APPLY_STATUS_ORDER.every(isHiddenApplyStatus)).toBe(true)
  })

  it('marks non-hidden statuses as visible', () => {
    expect(isHiddenApplyStatus('applied')).toBe(false)
    expect(isHiddenApplyStatus('interview')).toBe(false)
    expect(isHiddenApplyStatus('not-applied')).toBe(false)
    expect(isHiddenApplyStatus('unmet-requirements')).toBe(true)
  })

  it('allows transitions from unmet-requirements', () => {
    expect(availableTargetApplyStatuses('unmet-requirements')).toEqual(['not-applied', 'applied', 'stack-mismatch'])
    expect(canTransition('unmet-requirements', 'not-applied')).toBe(true)
    expect(canTransition('unmet-requirements', 'applied')).toBe(true)
    expect(canTransition('unmet-requirements', 'stack-mismatch')).toBe(true)
  })

  it('blocks transitions from stack-mismatch', () => {
    expect(availableTargetApplyStatuses('stack-mismatch')).toEqual([])
    expect(canTransition('stack-mismatch', 'not-applied')).toBe(false)
  })

  it('blocks transitions from terminal statuses', () => {
    expect(canTransition('offer-accepted', 'withdrawn')).toBe(false)
    expect(canTransition('rejected', 'applied')).toBe(false)
  })
})

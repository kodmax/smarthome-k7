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

  it('allows not-applied to applied, consider, not-interested, unmet-requirements, and stack-mismatch', () => {
    expect(canTransition('not-applied', 'applied')).toBe(true)
    expect(canTransition('not-applied', 'consider')).toBe(true)
    expect(canTransition('not-applied', 'not-interested')).toBe(true)
    expect(canTransition('not-applied', 'unmet-requirements')).toBe(true)
    expect(canTransition('not-applied', 'stack-mismatch')).toBe(true)
    expect(canTransition('not-applied', 'withdrawn')).toBe(false)
  })

  it('allows consider to the same targets as not-applied', () => {
    expect(availableTargetApplyStatuses('consider')).toEqual([
      'applied',
      'not-interested',
      'unmet-requirements',
      'stack-mismatch',
    ])
    expect(canTransition('consider', 'applied')).toBe(true)
    expect(canTransition('consider', 'not-applied')).toBe(false)
  })

  it('allows not-interested to not-applied, applied, unmet-requirements, stack-mismatch, and archived', () => {
    expect(canTransition('not-interested', 'not-applied')).toBe(true)
    expect(canTransition('not-interested', 'applied')).toBe(true)
    expect(canTransition('not-interested', 'unmet-requirements')).toBe(true)
    expect(canTransition('not-interested', 'stack-mismatch')).toBe(true)
    expect(canTransition('not-interested', 'archived')).toBe(true)
  })

  it('allows applied follow-up statuses', () => {
    expect(availableTargetApplyStatuses('applied')).toEqual([
      'rejected',
      'no-response',
      'interview',
      'withdrawn',
      'unmet-requirements',
    ])
    expect(canTransition('applied', 'unmet-requirements')).toBe(true)
  })

  it('allows the same follow-up statuses from no-response as from applied, except no-response itself', () => {
    expect(availableTargetApplyStatuses('no-response')).toEqual([
      'rejected',
      'interview',
      'withdrawn',
      'unmet-requirements',
      'archived',
    ])
    expect(canTransition('no-response', 'interview')).toBe(true)
    expect(canTransition('no-response', 'rejected')).toBe(true)
    expect(canTransition('no-response', 'archived')).toBe(true)
    expect(canTransition('no-response', 'no-response')).toBe(true)
  })

  it('never lists the current status as a target option', () => {
    expect(availableTargetApplyStatuses('applied')).not.toContain('applied')
    expect(availableTargetApplyStatuses('no-response')).not.toContain('no-response')
  })

  it('allows interview and offer follow-up statuses', () => {
    expect(availableTargetApplyStatuses('interview')).toEqual(['rejected', 'withdrawn', 'offer'])
    expect(availableTargetApplyStatuses('offer')).toEqual(['offer-accepted', 'withdrawn'])
  })

  it('lists terminal statuses in order', () => {
    expect(TERMINAL_APPLY_STATUS_ORDER).toEqual([
      'rejected',
      'offer-accepted',
      'withdrawn',
      'stack-mismatch',
      'archived',
    ])
    expect(TERMINAL_APPLY_STATUS_ORDER.every(isTerminalApplyStatus)).toBe(true)
    expect(isTerminalApplyStatus('no-response')).toBe(false)
    expect(isTerminalApplyStatus('unmet-requirements')).toBe(false)
    expect(isTerminalApplyStatus('archived')).toBe(true)
  })

  it('lists hidden statuses in order', () => {
    expect(HIDDEN_APPLY_STATUS_ORDER).toEqual([
      'rejected',
      'offer-accepted',
      'withdrawn',
      'stack-mismatch',
      'archived',
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
    expect(isHiddenApplyStatus('consider')).toBe(false)
    expect(isHiddenApplyStatus('unmet-requirements')).toBe(true)
  })

  it('allows transitions from unmet-requirements', () => {
    expect(availableTargetApplyStatuses('unmet-requirements')).toEqual([
      'not-applied',
      'applied',
      'stack-mismatch',
      'archived',
    ])
    expect(canTransition('unmet-requirements', 'not-applied')).toBe(true)
    expect(canTransition('unmet-requirements', 'applied')).toBe(true)
    expect(canTransition('unmet-requirements', 'stack-mismatch')).toBe(true)
    expect(canTransition('unmet-requirements', 'archived')).toBe(true)
  })

  it('blocks transitions from stack-mismatch except to archived', () => {
    expect(availableTargetApplyStatuses('stack-mismatch')).toEqual(['archived'])
    expect(canTransition('stack-mismatch', 'archived')).toBe(true)
    expect(canTransition('stack-mismatch', 'not-applied')).toBe(false)
  })

  it('allows transition to archived from terminal statuses', () => {
    expect(canTransition('rejected', 'archived')).toBe(true)
    expect(canTransition('offer-accepted', 'archived')).toBe(true)
    expect(canTransition('withdrawn', 'archived')).toBe(true)
    expect(canTransition('stack-mismatch', 'archived')).toBe(true)
  })

  it('blocks other transitions from terminal statuses', () => {
    expect(canTransition('offer-accepted', 'withdrawn')).toBe(false)
    expect(canTransition('rejected', 'applied')).toBe(false)
    expect(canTransition('archived', 'applied')).toBe(false)
    expect(canTransition('no-response', 'archived')).toBe(true)
  })
})

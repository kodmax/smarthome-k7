import { describe, expect, it } from 'vitest'
import {
  availableArchiveReasons,
  availableTargetStatuses,
  availableTransitions,
  availableUnarchiveTargets,
  canTransition,
  isArchivedApplyStatus,
} from './jobApplyStatusFlow'

describe('jobApplyStatusFlow', () => {
  it('allows self-transition for comment-only updates', () => {
    expect(canTransition('applied', 'applied', null, null)).toBe(true)
    expect(canTransition('archived', 'archived', 'rejected', 'rejected')).toBe(true)
  })

  it('allows pending-review forward transitions', () => {
    expect(canTransition('pending-review', 'consider', null, null)).toBe(true)
    expect(canTransition('pending-review', 'applied', null, null)).toBe(true)
    expect(canTransition('pending-review', 'archived', null, 'other')).toBe(true)
    expect(canTransition('pending-review', 'archived', null, 'stack-mismatch')).toBe(true)
    expect(canTransition('pending-review', 'interview', null, null)).toBe(false)
  })

  it('allows consider to applied and pre-application archive reasons', () => {
    expect(availableTransitions('consider', null)).toEqual([
      { to: 'applied' },
      { to: 'archived', archiveReason: 'other' },
      { to: 'archived', archiveReason: 'unmet-requirements' },
      { to: 'archived', archiveReason: 'stack-mismatch' },
      { to: 'archived', archiveReason: 'weak-match' },
      { to: 'archived', archiveReason: 'manager-track' },
      { to: 'archived', archiveReason: 'company-excluded' },
    ])
  })

  it('allows applied follow-up statuses and post-application archive reasons', () => {
    expect(availableTransitions('applied', null)).toEqual([
      { to: 'no-response' },
      { to: 'interview' },
      { to: 'archived', archiveReason: 'rejected' },
      { to: 'archived', archiveReason: 'withdrawn' },
    ])
  })

  it('allows no-response to interview and archive reasons including no-response', () => {
    expect(availableTransitions('no-response', null)).toEqual([
      { to: 'interview' },
      { to: 'archived', archiveReason: 'rejected' },
      { to: 'archived', archiveReason: 'withdrawn' },
      { to: 'archived', archiveReason: 'no-response' },
    ])
  })

  it('allows interview archive reasons including offer-accepted', () => {
    expect(availableArchiveReasons('interview')).toEqual(['rejected', 'withdrawn', 'offer-accepted'])
    expect(canTransition('interview', 'archived', null, 'offer-accepted')).toBe(true)
    expect(canTransition('interview', 'applied', null, null)).toBe(false)
  })

  it('lists unarchive targets by archive reason', () => {
    expect(availableUnarchiveTargets('other')).toEqual(['pending-review', 'consider'])
    expect(availableUnarchiveTargets('no-response')).toEqual(['interview'])
    expect(availableUnarchiveTargets('rejected')).toEqual([])
    expect(availableUnarchiveTargets('offer-accepted')).toEqual([])
  })

  it('allows unarchive transitions from archived', () => {
    expect(canTransition('archived', 'pending-review', 'other', null)).toBe(true)
    expect(canTransition('archived', 'interview', 'no-response', null)).toBe(true)
    expect(canTransition('archived', 'applied', 'rejected', null)).toBe(false)
  })

  it('requires archive reason when transitioning to archived', () => {
    expect(canTransition('applied', 'archived', null, null)).toBe(false)
    expect(canTransition('applied', 'archived', null, 'rejected')).toBe(true)
  })

  it('clears archive reason when leaving archived', () => {
    expect(canTransition('archived', 'consider', 'other', null)).toBe(true)
    expect(canTransition('archived', 'consider', 'other', 'other')).toBe(false)
  })

  it('marks archived as archived apply status', () => {
    expect(isArchivedApplyStatus('archived')).toBe(true)
    expect(isArchivedApplyStatus('applied')).toBe(false)
  })

  it('lists target statuses for pending-review including archived', () => {
    expect(availableTargetStatuses('pending-review', null)).toEqual(['consider', 'applied', 'archived'])
  })

  it('lists only archived as target from interview', () => {
    expect(availableTargetStatuses('interview', null)).toEqual(['archived'])
  })

  it('lists unarchive targets as target statuses from archived', () => {
    expect(availableTargetStatuses('archived', 'other')).toEqual(['pending-review', 'consider', 'archived'])
    expect(availableTargetStatuses('archived', 'no-response')).toEqual(['interview'])
    expect(availableTargetStatuses('archived', 'rejected')).toEqual([])
    expect(availableTargetStatuses('archived', null)).toEqual([])
  })

  it('allows pre-application rearchive within archived status', () => {
    expect(canTransition('archived', 'archived', 'other', 'weak-match')).toBe(true)
    expect(canTransition('archived', 'archived', 'other', 'rejected')).toBe(false)
    expect(canTransition('archived', 'archived', 'rejected', 'withdrawn')).toBe(false)
    expect(availableTransitions('archived', 'stack-mismatch')).toEqual([
      { to: 'pending-review' },
      { to: 'consider' },
      { to: 'archived', archiveReason: 'other' },
      { to: 'archived', archiveReason: 'unmet-requirements' },
      { to: 'archived', archiveReason: 'stack-mismatch' },
      { to: 'archived', archiveReason: 'weak-match' },
      { to: 'archived', archiveReason: 'manager-track' },
      { to: 'archived', archiveReason: 'company-excluded' },
    ])
  })
})

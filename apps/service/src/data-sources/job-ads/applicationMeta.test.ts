import { describe, expect, it } from 'vitest'
import {
  applyStatusChange,
  emptyApplicationMeta,
  parseApplicationMeta,
  parseChangeStateCommandArgs,
  resolveStatusChangedAt,
} from './applicationMeta'

describe('applicationMeta', () => {
  it('sets appliedAt only on first transition to applied', () => {
    const now = new Date('2026-07-19T12:00:00.000Z')

    expect(applyStatusChange(emptyApplicationMeta(), { applyStatus: 'applied' }, now)).toEqual({
      applyStatus: 'applied',
      archiveReason: null,
      comment: null,
      appliedAt: '2026-07-19T12:00:00.000Z',
      rejectedAt: null,
      statusChangedAt: null,
    })

    expect(
      applyStatusChange(
        {
          applyStatus: 'applied',
          archiveReason: null,
          comment: null,
          appliedAt: '2026-07-19T12:00:00.000Z',
          rejectedAt: null,
          statusChangedAt: null,
        },
        { applyStatus: 'interview' },
        now,
      ),
    ).toEqual({
      applyStatus: 'interview',
      archiveReason: null,
      comment: null,
      appliedAt: '2026-07-19T12:00:00.000Z',
      rejectedAt: null,
      statusChangedAt: null,
    })
  })

  it('sets rejectedAt when archiving with rejected and preserves it on comment-only updates', () => {
    const now = new Date('2026-07-19T12:00:00.000Z')

    expect(
      applyStatusChange(
        {
          applyStatus: 'applied',
          archiveReason: null,
          comment: null,
          appliedAt: '2026-07-18T12:00:00.000Z',
          rejectedAt: null,
          statusChangedAt: null,
        },
        { applyStatus: 'archived', archiveReason: 'rejected' },
        now,
      ),
    ).toEqual({
      applyStatus: 'archived',
      archiveReason: 'rejected',
      comment: null,
      appliedAt: '2026-07-18T12:00:00.000Z',
      rejectedAt: '2026-07-19T12:00:00.000Z',
      statusChangedAt: null,
    })

    expect(
      applyStatusChange(
        {
          applyStatus: 'archived',
          archiveReason: 'rejected',
          comment: null,
          appliedAt: '2026-07-18T12:00:00.000Z',
          rejectedAt: '2026-07-19T12:00:00.000Z',
          statusChangedAt: null,
        },
        { applyStatus: 'archived', archiveReason: 'rejected', comment: 'No fit' },
        new Date('2026-07-20T12:00:00.000Z'),
      ),
    ).toEqual({
      applyStatus: 'archived',
      archiveReason: 'rejected',
      comment: 'No fit',
      appliedAt: '2026-07-18T12:00:00.000Z',
      rejectedAt: '2026-07-19T12:00:00.000Z',
      statusChangedAt: null,
    })
  })

  it('allows comment-only self transition', () => {
    expect(
      applyStatusChange(
        {
          applyStatus: 'applied',
          archiveReason: null,
          comment: null,
          appliedAt: '2026-07-19T12:00:00.000Z',
          rejectedAt: null,
          statusChangedAt: null,
        },
        { applyStatus: 'applied', comment: 'Follow-up sent' },
      ),
    ).toEqual({
      applyStatus: 'applied',
      archiveReason: null,
      comment: 'Follow-up sent',
      appliedAt: '2026-07-19T12:00:00.000Z',
      rejectedAt: null,
      statusChangedAt: null,
    })
  })

  it('rejects invalid transitions', () => {
    expect(applyStatusChange(emptyApplicationMeta(), { applyStatus: 'interview' })).toBeNull()
    expect(applyStatusChange(emptyApplicationMeta(), { applyStatus: 'archived', archiveReason: 'rejected' })).toBeNull()
  })

  it('allows transition from pending-review to consider', () => {
    expect(
      applyStatusChange(emptyApplicationMeta(), {
        applyStatus: 'consider',
        comment: 'Salary too low',
      }),
    ).toEqual({
      applyStatus: 'consider',
      archiveReason: null,
      comment: 'Salary too low',
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    })
  })

  it('allows transition from pending-review to archived with pre-application reason', () => {
    expect(
      applyStatusChange(emptyApplicationMeta(), {
        applyStatus: 'archived',
        archiveReason: 'unmet-requirements',
        comment: 'React',
      }),
    ).toEqual({
      applyStatus: 'archived',
      archiveReason: 'unmet-requirements',
      comment: 'React',
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    })
  })

  it('clears comment when changing status without a new comment', () => {
    expect(
      applyStatusChange(
        {
          applyStatus: 'applied',
          archiveReason: null,
          comment: 'Old note',
          appliedAt: '2026-07-19T12:00:00.000Z',
          rejectedAt: null,
          statusChangedAt: null,
        },
        { applyStatus: 'interview' },
      ),
    ).toEqual({
      applyStatus: 'interview',
      archiveReason: null,
      comment: null,
      appliedAt: '2026-07-19T12:00:00.000Z',
      rejectedAt: null,
      statusChangedAt: null,
    })
  })

  it('clears comment and archiveReason when unarchiving', () => {
    expect(
      applyStatusChange(
        {
          applyStatus: 'archived',
          archiveReason: 'other',
          comment: 'Not for me',
          appliedAt: null,
          rejectedAt: null,
          statusChangedAt: null,
        },
        { applyStatus: 'consider' },
      ),
    ).toEqual({
      applyStatus: 'consider',
      archiveReason: null,
      comment: null,
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    })
  })

  it('allows pre-application rearchive while staying archived', () => {
    expect(
      applyStatusChange(
        {
          applyStatus: 'archived',
          archiveReason: 'other',
          comment: 'Old note',
          appliedAt: null,
          rejectedAt: null,
          statusChangedAt: null,
        },
        { applyStatus: 'archived', archiveReason: 'weak-match', comment: 'Low match' },
      ),
    ).toEqual({
      applyStatus: 'archived',
      archiveReason: 'weak-match',
      comment: 'Low match',
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    })
  })

  it('rejects rearchive outside pre-application reasons', () => {
    expect(
      applyStatusChange(
        {
          applyStatus: 'archived',
          archiveReason: 'rejected',
          comment: null,
          appliedAt: '2026-07-18T12:00:00.000Z',
          rejectedAt: '2026-07-19T12:00:00.000Z',
          statusChangedAt: null,
        },
        { applyStatus: 'archived', archiveReason: 'withdrawn' },
      ),
    ).toBeNull()
  })

  it('allows interview to archived with offer-accepted', () => {
    expect(
      applyStatusChange(
        {
          applyStatus: 'interview',
          archiveReason: null,
          comment: null,
          appliedAt: '2026-07-18T12:00:00.000Z',
          rejectedAt: null,
          statusChangedAt: null,
        },
        { applyStatus: 'archived', archiveReason: 'offer-accepted' },
      ),
    ).toEqual({
      applyStatus: 'archived',
      archiveReason: 'offer-accepted',
      comment: null,
      appliedAt: '2026-07-18T12:00:00.000Z',
      rejectedAt: null,
      statusChangedAt: null,
    })
  })

  it('parses application meta with archiveReason', () => {
    expect(
      parseApplicationMeta({
        applyStatus: 'archived',
        archiveReason: 'rejected',
        comment: null,
        appliedAt: '2026-07-18T12:00:00.000Z',
        rejectedAt: '2026-07-19T12:00:00.000Z',
        statusChangedAt: null,
      }),
    ).toEqual({
      applyStatus: 'archived',
      archiveReason: 'rejected',
      comment: null,
      appliedAt: '2026-07-18T12:00:00.000Z',
      rejectedAt: '2026-07-19T12:00:00.000Z',
      statusChangedAt: null,
    })
  })

  it('rejects archived meta without archiveReason', () => {
    expect(
      parseApplicationMeta({
        applyStatus: 'archived',
        comment: null,
        appliedAt: null,
        rejectedAt: null,
        statusChangedAt: null,
      }),
    ).toBeNull()
  })

  it('maps legacy not-interested archive reason to other', () => {
    expect(
      parseApplicationMeta({
        applyStatus: 'archived',
        archiveReason: 'not-interested',
        comment: null,
        appliedAt: null,
        rejectedAt: null,
        statusChangedAt: null,
      }),
    ).toEqual({
      applyStatus: 'archived',
      archiveReason: 'other',
      comment: null,
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    })
  })

  it('derives statusChangedAt from meta row timestamp', () => {
    expect(resolveStatusChangedAt('consider', '2026-07-19T15:00:00.000Z')).toBe('2026-07-19T15:00:00.000Z')
    expect(resolveStatusChangedAt('pending-review', '2026-07-19T15:00:00.000Z')).toBeNull()
    expect(resolveStatusChangedAt('applied', undefined)).toBeNull()
  })

  it('parses change-state command args', () => {
    expect(
      parseChangeStateCommandArgs(JSON.stringify({ id: 'jj-1', applyStatus: 'applied', comment: 'CV sent' })),
    ).toEqual({
      id: 'jj-1',
      applyStatus: 'applied',
      comment: 'CV sent',
    })

    expect(
      parseChangeStateCommandArgs(JSON.stringify({ id: 'jj-2', applyStatus: 'archived', archiveReason: 'other' })),
    ).toEqual({
      id: 'jj-2',
      applyStatus: 'archived',
      archiveReason: 'other',
    })
  })
})

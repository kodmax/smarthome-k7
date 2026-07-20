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
      comment: null,
      appliedAt: '2026-07-19T12:00:00.000Z',
    })

    expect(
      applyStatusChange(
        {
          applyStatus: 'applied',
          comment: null,
          appliedAt: '2026-07-19T12:00:00.000Z',
        },
        { applyStatus: 'interview' },
        now,
      ),
    ).toEqual({
      applyStatus: 'interview',
      comment: null,
      appliedAt: '2026-07-19T12:00:00.000Z',
    })
  })

  it('allows comment-only self transition', () => {
    expect(
      applyStatusChange(
        {
          applyStatus: 'applied',
          comment: null,
          appliedAt: '2026-07-19T12:00:00.000Z',
        },
        { applyStatus: 'applied', comment: 'Follow-up sent' },
      ),
    ).toEqual({
      applyStatus: 'applied',
      comment: 'Follow-up sent',
      appliedAt: '2026-07-19T12:00:00.000Z',
    })
  })

  it('rejects invalid transitions', () => {
    expect(applyStatusChange(emptyApplicationMeta(), { applyStatus: 'offer-accepted' })).toBeNull()
  })

  it('allows transition from not-applied to unmet-requirements', () => {
    expect(
      applyStatusChange(emptyApplicationMeta(), {
        applyStatus: 'unmet-requirements',
        comment: 'React',
      }),
    ).toEqual({
      applyStatus: 'unmet-requirements',
      comment: 'React',
      appliedAt: null,
    })
  })

  it('clears comment when changing status without a new comment', () => {
    expect(
      applyStatusChange(
        {
          applyStatus: 'applied',
          comment: 'Old note',
          appliedAt: '2026-07-19T12:00:00.000Z',
        },
        { applyStatus: 'interview' },
      ),
    ).toEqual({
      applyStatus: 'interview',
      comment: null,
      appliedAt: '2026-07-19T12:00:00.000Z',
    })
  })

  it('clears comment on comment-only update with empty string', () => {
    expect(
      applyStatusChange(
        {
          applyStatus: 'applied',
          comment: 'Old note',
          appliedAt: '2026-07-19T12:00:00.000Z',
        },
        { applyStatus: 'applied', comment: '' },
      ),
    ).toEqual({
      applyStatus: 'applied',
      comment: null,
      appliedAt: '2026-07-19T12:00:00.000Z',
    })
  })

  it('ignores legacy statusChangedAt field in stored application meta', () => {
    expect(
      parseApplicationMeta({
        applyStatus: 'not-interested',
        comment: 'Not for me',
        appliedAt: null,
        statusChangedAt: '2026-07-19T15:00:00.000Z',
      }),
    ).toEqual({
      applyStatus: 'not-interested',
      comment: 'Not for me',
      appliedAt: null,
    })
  })

  it('derives statusChangedAt from meta row timestamp', () => {
    expect(resolveStatusChangedAt('not-interested', '2026-07-19T15:00:00.000Z')).toBe('2026-07-19T15:00:00.000Z')
    expect(resolveStatusChangedAt('not-applied', '2026-07-19T15:00:00.000Z')).toBeNull()
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
  })
})

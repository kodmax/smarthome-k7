import {
  DEFAULT_JOB_APPLY_STATUS,
  JobAdApplicationMeta,
  JobAdArchiveReason,
  JobApplyStatus,
  canTransition,
} from '@repo/types'
import { captureInvalidInput } from '@/sentry'

const APPLY_STATUSES = new Set<JobApplyStatus>(['pending-review', 'consider', 'applied', 'interview', 'archived'])

const ARCHIVE_REASONS = new Set<JobAdArchiveReason>([
  'other',
  'company-excluded',
  'unmet-requirements',
  'stack-mismatch',
  'weak-match',
  'manager-track',
  'no-response',
  'rejected',
  'withdrawn',
  'offer-accepted',
])

export function emptyApplicationMeta(): JobAdApplicationMeta {
  return {
    applyStatus: DEFAULT_JOB_APPLY_STATUS,
    archiveReason: null,
    comment: null,
    appliedAt: null,
    rejectedAt: null,
    statusChangedAt: null,
  }
}

export function isJobApplyStatus(value: unknown): value is JobApplyStatus {
  return typeof value === 'string' && APPLY_STATUSES.has(value as JobApplyStatus)
}

export function isJobAdArchiveReason(value: unknown): value is JobAdArchiveReason {
  return typeof value === 'string' && ARCHIVE_REASONS.has(value as JobAdArchiveReason)
}

export function toAppliedAtIso(value: Date | string): string {
  if (typeof value === 'string') {
    return value
  }

  return value.toISOString()
}

export function resolveStatusChangedAt(
  applyStatus: JobApplyStatus,
  lastUpdateTimestamp?: Date | string,
): string | null {
  if (applyStatus === 'pending-review' || lastUpdateTimestamp === undefined) {
    return null
  }

  return toAppliedAtIso(lastUpdateTimestamp)
}

export type ChangeApplyStatusInput = {
  applyStatus: JobApplyStatus
  archiveReason?: JobAdArchiveReason
  comment?: string
}

export function applyStatusChange(
  current: JobAdApplicationMeta,
  input: ChangeApplyStatusInput,
  now: Date = new Date(),
): JobAdApplicationMeta | null {
  const { applyStatus: to, comment } = input
  const resolvedToArchiveReason = to === 'archived' ? (input.archiveReason ?? null) : null

  if (to === current.applyStatus) {
    if (to === 'archived' && resolvedToArchiveReason !== null && resolvedToArchiveReason !== current.archiveReason) {
      if (!canTransition(current.applyStatus, to, current.archiveReason, resolvedToArchiveReason)) {
        return null
      }

      return {
        ...current,
        archiveReason: resolvedToArchiveReason,
        comment: comment !== undefined ? comment || null : current.comment,
      }
    }

    if (comment === undefined) {
      return current
    }

    return {
      ...current,
      comment: comment || null,
    }
  }

  if (!canTransition(current.applyStatus, to, current.archiveReason, resolvedToArchiveReason)) {
    return null
  }

  const isUnarchive = current.applyStatus === 'archived' && to !== 'archived'
  const nextArchiveReason = to === 'archived' ? resolvedToArchiveReason : null

  const next: JobAdApplicationMeta = {
    applyStatus: to,
    archiveReason: nextArchiveReason,
    comment: isUnarchive ? null : comment !== undefined ? comment || null : null,
    appliedAt: current.appliedAt,
    rejectedAt:
      to === 'archived' && resolvedToArchiveReason === 'rejected'
        ? (current.rejectedAt ?? now.toISOString())
        : isUnarchive
          ? current.rejectedAt
          : to !== 'archived'
            ? null
            : current.rejectedAt,
    statusChangedAt: current.statusChangedAt,
  }

  if (to === 'applied' && next.appliedAt === null) {
    next.appliedAt = now.toISOString()
  }

  return next
}

export type ChangeStateCommandArgs = {
  id: string
  applyStatus: JobApplyStatus
  archiveReason?: JobAdArchiveReason
  comment?: string
}

export function parseChangeStateCommandArgs(args: string): ChangeStateCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.id !== 'string' || !isJobApplyStatus(parsed.applyStatus)) {
      captureInvalidInput('job-ads: invalid change-state command args', args)
      return null
    }

    if (parsed.comment !== undefined && typeof parsed.comment !== 'string') {
      captureInvalidInput('job-ads: invalid change-state command comment', args)
      return null
    }

    if (parsed.archiveReason !== undefined && !isJobAdArchiveReason(parsed.archiveReason)) {
      captureInvalidInput('job-ads: invalid change-state command archiveReason', args)
      return null
    }

    if (parsed.applyStatus === 'archived' && parsed.archiveReason === undefined) {
      captureInvalidInput('job-ads: missing archiveReason for archived status', args)
      return null
    }

    if (parsed.applyStatus !== 'archived' && parsed.archiveReason !== undefined) {
      captureInvalidInput('job-ads: unexpected archiveReason for non-archived status', args)
      return null
    }

    return {
      id: parsed.id,
      applyStatus: parsed.applyStatus,
      archiveReason: parsed.archiveReason,
      comment: parsed.comment,
    }
  } catch (cause) {
    captureInvalidInput('job-ads: failed to parse change-state command args', cause)
    return null
  }
}

import { DEFAULT_JOB_APPLY_STATUS, JobAdApplicationMeta, JobApplyStatus, canTransition } from '@repo/types'

const APPLY_STATUSES = new Set<JobApplyStatus>([
  'not-applied',
  'applied',
  'not-interested',
  'unmet-requirements',
  'rejected',
  'no-response',
  'interview',
  'offer',
  'offer-accepted',
  'withdrawn',
])

export function emptyApplicationMeta(): JobAdApplicationMeta {
  return {
    applyStatus: DEFAULT_JOB_APPLY_STATUS,
    comment: null,
    appliedAt: null,
  }
}

export function isJobApplyStatus(value: unknown): value is JobApplyStatus {
  return typeof value === 'string' && APPLY_STATUSES.has(value as JobApplyStatus)
}

function parseOptionalTimestamp(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }

  return typeof value === 'string' ? value : null
}

function parseOptionalComment(value: unknown): string | null {
  if (value === null || value === undefined) {
    return null
  }

  return typeof value === 'string' ? value : null
}

export function parseApplicationMeta(value: unknown): JobAdApplicationMeta | null {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return null
  }

  const record = value as Record<string, unknown>
  if (!isJobApplyStatus(record.applyStatus)) {
    return null
  }

  return {
    applyStatus: record.applyStatus,
    comment: parseOptionalComment(record.comment),
    appliedAt: parseOptionalTimestamp(record.appliedAt),
  }
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
  if (applyStatus === 'not-applied' || lastUpdateTimestamp === undefined) {
    return null
  }

  return toAppliedAtIso(lastUpdateTimestamp)
}

export type ChangeApplyStatusInput = {
  applyStatus: JobApplyStatus
  comment?: string
}

export function applyStatusChange(
  current: JobAdApplicationMeta,
  input: ChangeApplyStatusInput,
  now: Date = new Date(),
): JobAdApplicationMeta | null {
  const { applyStatus: to, comment } = input

  if (to === current.applyStatus) {
    if (comment === undefined) {
      return current
    }

    return {
      ...current,
      comment: comment || null,
    }
  }

  if (!canTransition(current.applyStatus, to)) {
    return null
  }

  const next: JobAdApplicationMeta = {
    applyStatus: to,
    comment: comment !== undefined ? comment || null : null,
    appliedAt: current.appliedAt,
  }

  if (to === 'applied' && next.appliedAt === null) {
    next.appliedAt = now.toISOString()
  }

  return next
}

export type ChangeStateCommandArgs = {
  id: string
  applyStatus: JobApplyStatus
  comment?: string
}

export function parseChangeStateCommandArgs(args: string): ChangeStateCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.id !== 'string' || !isJobApplyStatus(parsed.applyStatus)) {
      return null
    }

    if (parsed.comment !== undefined && typeof parsed.comment !== 'string') {
      return null
    }

    return {
      id: parsed.id,
      applyStatus: parsed.applyStatus,
      comment: parsed.comment,
    }
  } catch {
    return null
  }
}

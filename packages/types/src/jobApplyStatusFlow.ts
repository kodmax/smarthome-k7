export type JobApplyStatus = 'pending-review' | 'consider' | 'applied' | 'no-response' | 'interview' | 'archived'

export type JobAdArchiveReason =
  | 'not-interested'
  | 'unmet-requirements'
  | 'stack-mismatch'
  | 'weak-match'
  | 'no-response'
  | 'rejected'
  | 'withdrawn'
  | 'offer-accepted'

export const DEFAULT_JOB_APPLY_STATUS: JobApplyStatus = 'pending-review'

export type ApplyStatusTransition = {
  to: JobApplyStatus
  archiveReason?: JobAdArchiveReason
}

const PRE_APPLICATION_ARCHIVE_REASONS = [
  'not-interested',
  'unmet-requirements',
  'stack-mismatch',
  'weak-match',
] as const satisfies readonly JobAdArchiveReason[]

const POST_APPLICATION_ARCHIVE_REASONS = ['rejected', 'withdrawn'] as const satisfies readonly JobAdArchiveReason[]

const NO_RESPONSE_ARCHIVE_REASONS = [
  'rejected',
  'withdrawn',
  'no-response',
] as const satisfies readonly JobAdArchiveReason[]

const INTERVIEW_ARCHIVE_REASONS = [
  'rejected',
  'withdrawn',
  'offer-accepted',
] as const satisfies readonly JobAdArchiveReason[]

const STATUS_TRANSITIONS: Record<JobApplyStatus, readonly JobApplyStatus[]> = {
  'pending-review': ['consider', 'applied'],
  consider: ['applied'],
  applied: ['no-response', 'interview'],
  'no-response': ['interview'],
  interview: [],
  archived: [],
}

const UNARCHIVE_TARGETS: Record<JobAdArchiveReason, readonly JobApplyStatus[]> = {
  'not-interested': ['pending-review', 'consider'],
  'unmet-requirements': ['pending-review', 'consider'],
  'stack-mismatch': ['pending-review', 'consider'],
  'weak-match': ['pending-review', 'consider'],
  'no-response': ['interview'],
  rejected: [],
  withdrawn: [],
  'offer-accepted': [],
}

export function isArchivedApplyStatus(status: JobApplyStatus): boolean {
  return status === 'archived'
}

export function availableArchiveReasons(from: JobApplyStatus): JobAdArchiveReason[] {
  switch (from) {
    case 'pending-review':
    case 'consider':
      return [...PRE_APPLICATION_ARCHIVE_REASONS]
    case 'applied':
      return [...POST_APPLICATION_ARCHIVE_REASONS]
    case 'no-response':
      return [...NO_RESPONSE_ARCHIVE_REASONS]
    case 'interview':
      return [...INTERVIEW_ARCHIVE_REASONS]
    default:
      return []
  }
}

export function availableUnarchiveTargets(archiveReason: JobAdArchiveReason): JobApplyStatus[] {
  return [...UNARCHIVE_TARGETS[archiveReason]]
}

export function canTransition(
  from: JobApplyStatus,
  to: JobApplyStatus,
  fromArchiveReason: JobAdArchiveReason | null,
  toArchiveReason: JobAdArchiveReason | null,
): boolean {
  if (from === to) {
    if (from === 'archived') {
      return fromArchiveReason === toArchiveReason
    }

    return toArchiveReason === null
  }

  if (to === 'archived') {
    return toArchiveReason !== null && availableArchiveReasons(from).includes(toArchiveReason)
  }

  if (from === 'archived') {
    return (
      fromArchiveReason !== null &&
      toArchiveReason === null &&
      availableUnarchiveTargets(fromArchiveReason).includes(to)
    )
  }

  return toArchiveReason === null && STATUS_TRANSITIONS[from].includes(to)
}

export function availableTargetStatuses(
  from: JobApplyStatus,
  archiveReason: JobAdArchiveReason | null,
): JobApplyStatus[] {
  if (from === 'archived') {
    if (archiveReason === null) {
      return []
    }

    return availableUnarchiveTargets(archiveReason)
  }

  const forward = [...STATUS_TRANSITIONS[from]]
  if (availableArchiveReasons(from).length > 0) {
    forward.push('archived')
  }

  return forward
}

export function availableTransitions(
  from: JobApplyStatus,
  archiveReason: JobAdArchiveReason | null,
): ApplyStatusTransition[] {
  if (from === 'archived') {
    if (archiveReason === null) {
      return []
    }

    return availableUnarchiveTargets(archiveReason).map(to => ({ to }))
  }

  const forward = STATUS_TRANSITIONS[from].map(to => ({ to }))
  const archive = availableArchiveReasons(from).map(reason => ({
    to: 'archived' as const,
    archiveReason: reason,
  }))

  return [...forward, ...archive]
}

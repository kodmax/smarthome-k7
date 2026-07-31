export type JobApplyStatus =
  | 'not-applied'
  | 'consider'
  | 'applied'
  | 'not-interested'
  | 'unmet-requirements'
  | 'stack-mismatch'
  | 'rejected'
  | 'no-response'
  | 'interview'
  | 'offer'
  | 'offer-accepted'
  | 'withdrawn'
  | 'archived'

export const DEFAULT_JOB_APPLY_STATUS: JobApplyStatus = 'not-applied'

export const TERMINAL_APPLY_STATUS_ORDER = [
  'rejected',
  'offer-accepted',
  'withdrawn',
  'stack-mismatch',
  'archived',
] as const satisfies readonly JobApplyStatus[]

export const HIDDEN_APPLY_STATUS_ORDER = [
  ...TERMINAL_APPLY_STATUS_ORDER,
  'not-interested',
  'no-response',
  'unmet-requirements',
] as const satisfies readonly JobApplyStatus[]

const TERMINAL_APPLY_STATUSES = new Set<JobApplyStatus>(TERMINAL_APPLY_STATUS_ORDER)
const HIDDEN_APPLY_STATUSES = new Set<JobApplyStatus>(HIDDEN_APPLY_STATUS_ORDER)

const APPLIED_FOLLOW_UP_STATUSES = [
  'rejected',
  'no-response',
  'interview',
  'withdrawn',
  'unmet-requirements',
] as const satisfies readonly JobApplyStatus[]

const NO_RESPONSE_FOLLOW_UP_STATUSES = [
  'rejected',
  'interview',
  'withdrawn',
  'unmet-requirements',
  'archived',
] as const satisfies readonly JobApplyStatus[]

const PRE_APPLICATION_TARGETS = [
  'applied',
  'not-interested',
  'unmet-requirements',
  'stack-mismatch',
] as const satisfies readonly JobApplyStatus[]

const ARCHIVE_TRANSITION = ['archived'] as const satisfies readonly JobApplyStatus[]

const TRANSITIONS: Record<JobApplyStatus, readonly JobApplyStatus[]> = {
  'not-applied': ['consider', ...PRE_APPLICATION_TARGETS],
  consider: PRE_APPLICATION_TARGETS,
  applied: APPLIED_FOLLOW_UP_STATUSES,
  'not-interested': ['not-applied', 'applied', 'unmet-requirements', 'stack-mismatch', 'archived'],
  'unmet-requirements': ['not-applied', 'applied', 'stack-mismatch', 'archived'],
  'stack-mismatch': ARCHIVE_TRANSITION,
  rejected: ARCHIVE_TRANSITION,
  'no-response': NO_RESPONSE_FOLLOW_UP_STATUSES,
  interview: ['rejected', 'withdrawn', 'offer'],
  offer: ['offer-accepted', 'withdrawn'],
  'offer-accepted': ARCHIVE_TRANSITION,
  withdrawn: ARCHIVE_TRANSITION,
  archived: [],
}

export function canTransition(from: JobApplyStatus, to: JobApplyStatus): boolean {
  if (from === to) {
    return true
  }

  return TRANSITIONS[from].includes(to)
}

export function availableTargetApplyStatuses(from: JobApplyStatus): JobApplyStatus[] {
  return TRANSITIONS[from].filter(status => status !== from)
}

export function isTerminalApplyStatus(status: JobApplyStatus): boolean {
  return TERMINAL_APPLY_STATUSES.has(status)
}

export function isHiddenApplyStatus(status: JobApplyStatus): boolean {
  return HIDDEN_APPLY_STATUSES.has(status)
}

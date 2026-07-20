export type JobApplyStatus =
  | 'not-applied'
  | 'applied'
  | 'not-interested'
  | 'unmet-requirements'
  | 'rejected'
  | 'no-response'
  | 'interview'
  | 'offer'
  | 'offer-accepted'
  | 'withdrawn'

export const DEFAULT_JOB_APPLY_STATUS: JobApplyStatus = 'not-applied'

export const TERMINAL_APPLY_STATUS_ORDER = [
  'rejected',
  'offer-accepted',
  'withdrawn',
  'unmet-requirements',
] as const satisfies readonly JobApplyStatus[]

export const HIDDEN_APPLY_STATUS_ORDER = [
  ...TERMINAL_APPLY_STATUS_ORDER,
  'not-interested',
  'no-response',
] as const satisfies readonly JobApplyStatus[]

const TERMINAL_APPLY_STATUSES = new Set<JobApplyStatus>(TERMINAL_APPLY_STATUS_ORDER)
const HIDDEN_APPLY_STATUSES = new Set<JobApplyStatus>(HIDDEN_APPLY_STATUS_ORDER)

const APPLIED_FOLLOW_UP_STATUSES = [
  'rejected',
  'no-response',
  'interview',
  'withdrawn',
] as const satisfies readonly JobApplyStatus[]

const TRANSITIONS: Record<JobApplyStatus, readonly JobApplyStatus[]> = {
  'not-applied': ['applied', 'not-interested', 'unmet-requirements'],
  applied: APPLIED_FOLLOW_UP_STATUSES,
  'not-interested': ['not-applied', 'applied', 'unmet-requirements'],
  'unmet-requirements': [],
  rejected: [],
  'no-response': APPLIED_FOLLOW_UP_STATUSES,
  interview: ['rejected', 'withdrawn', 'offer'],
  offer: ['offer-accepted', 'withdrawn'],
  'offer-accepted': [],
  withdrawn: [],
}

export function canTransition(from: JobApplyStatus, to: JobApplyStatus): boolean {
  if (from === to) {
    return true
  }

  return TRANSITIONS[from].includes(to)
}

export function availableTargetApplyStatuses(from: JobApplyStatus): JobApplyStatus[] {
  return [...TRANSITIONS[from]]
}

export function isTerminalApplyStatus(status: JobApplyStatus): boolean {
  return TERMINAL_APPLY_STATUSES.has(status)
}

export function isHiddenApplyStatus(status: JobApplyStatus): boolean {
  return HIDDEN_APPLY_STATUSES.has(status)
}

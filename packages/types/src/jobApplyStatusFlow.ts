export type JobApplyStatus =
  | 'not-applied'
  | 'applied'
  | 'not-interested'
  | 'rejected'
  | 'no-response'
  | 'interview'
  | 'offer'
  | 'offer-accepted'
  | 'withdrawn'

export const DEFAULT_JOB_APPLY_STATUS: JobApplyStatus = 'not-applied'

const TERMINAL_APPLY_STATUSES = new Set<JobApplyStatus>(['rejected', 'no-response', 'offer-accepted', 'withdrawn'])

const TRANSITIONS: Record<JobApplyStatus, readonly JobApplyStatus[]> = {
  'not-applied': ['applied', 'not-interested'],
  applied: ['rejected', 'no-response', 'interview', 'withdrawn'],
  'not-interested': ['not-applied', 'applied'],
  rejected: [],
  'no-response': [],
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

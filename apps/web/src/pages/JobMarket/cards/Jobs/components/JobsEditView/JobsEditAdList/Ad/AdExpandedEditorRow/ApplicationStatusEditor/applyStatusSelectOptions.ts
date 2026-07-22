import { JobApplyStatus, availableTargetApplyStatuses } from '@repo/types'

export function applyStatusTargetOptions(current: JobApplyStatus): JobApplyStatus[] {
  return [...availableTargetApplyStatuses(current)]
}

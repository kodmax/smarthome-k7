import { availableArchiveReasons, availableTargetStatuses, JobAdArchiveReason, JobApplyStatus } from '@repo/types'

export function applyStatusTargetStatuses(
  currentStatus: JobApplyStatus,
  archiveReason: JobAdArchiveReason | null,
): JobApplyStatus[] {
  return availableTargetStatuses(currentStatus, archiveReason)
}

export function applyArchiveReasonOptions(currentStatus: JobApplyStatus): JobAdArchiveReason[] {
  return availableArchiveReasons(currentStatus)
}

import {
  availableArchiveReasons,
  availableRearchiveReasons,
  availableTargetStatuses,
  JobAdArchiveReason,
  JobApplyStatus,
} from '@repo/types'

export function applyStatusTargetStatuses(
  currentStatus: JobApplyStatus,
  archiveReason: JobAdArchiveReason | null,
): JobApplyStatus[] {
  return availableTargetStatuses(currentStatus, archiveReason)
}

export function applyArchiveReasonOptions(
  currentStatus: JobApplyStatus,
  currentArchiveReason: JobAdArchiveReason | null = null,
): JobAdArchiveReason[] {
  if (currentStatus === 'archived') {
    if (currentArchiveReason === null) {
      return []
    }

    return availableRearchiveReasons(currentArchiveReason)
  }

  return availableArchiveReasons(currentStatus)
}

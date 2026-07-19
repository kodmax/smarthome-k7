import { JobAdApplication } from '@repo/types'
import { FC } from 'react'
import { formatAppliedDaysShort } from './formatAppliedDaysAgo'

export const AppliedDaysPrefix: FC<{
  editMode: boolean
  application: JobAdApplication
}> = ({ editMode, application }) => {
  if (!editMode || application.status !== 'applied') {
    return null
  }

  const appliedDaysShort = formatAppliedDaysShort(application.appliedAt)

  if (appliedDaysShort === null) {
    return null
  }

  return <span style={{ color: 'var(--mui-palette-text-secondary)' }}>{appliedDaysShort}</span>
}

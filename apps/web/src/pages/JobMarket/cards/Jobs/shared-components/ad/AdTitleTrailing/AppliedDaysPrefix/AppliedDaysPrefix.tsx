import { JobAdApplication } from '@repo/types'
import { FC } from 'react'
import { formatAppliedDaysShort } from './formatAppliedDaysShort'

export const AppliedDaysPrefix: FC<{
  application: JobAdApplication
}> = ({ application }) => {
  if (application.status !== 'applied') {
    return null
  }

  const appliedDaysShort = formatAppliedDaysShort(application.appliedAt)

  if (appliedDaysShort === null) {
    return null
  }

  return <span style={{ color: 'var(--mui-palette-text-secondary)' }}>{appliedDaysShort}</span>
}

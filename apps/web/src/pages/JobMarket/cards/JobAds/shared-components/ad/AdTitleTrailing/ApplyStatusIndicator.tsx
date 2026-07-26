import { Tooltip } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { JobAdsFeedItem } from '@repo/types'
import { FC, useMemo } from 'react'
import { useTranslations } from '@/i18n'
import { formatAppliedDaysShort } from './AppliedDaysPrefix/formatAppliedDaysShort'
import { ApplyStatusIcon } from './ApplyStatusIcon'

export const ApplyStatusIndicator: FC<{ ad: Pick<JobAdsFeedItem, 'meta'> }> = ({ ad }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds
  const application = ad.meta.application

  const tooltip = useMemo(() => {
    const statusLabel = labels.applyStatus[application.status]

    if (application.comment) {
      return `${statusLabel}\n${application.comment}`
    }

    return statusLabel
  }, [application.comment, application.status, labels.applyStatus])

  if (application.status === 'not-applied') {
    return null
  }

  const appliedDaysShort = application.status === 'applied' ? formatAppliedDaysShort(application.appliedAt) : null

  return (
    <Tooltip title={tooltip}>
      <span
        aria-label={labels.applyStatus[application.status]}
        style={{
          verticalAlign: 'middle',
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${designTokens.space[1]}px`,
          fontSize: 'inherit',
          lineHeight: 1,
        }}
      >
        <ApplyStatusIcon status={application.status} />
        {appliedDaysShort !== null ? (
          <span style={{ color: 'var(--mui-palette-text-secondary)', fontSize: 'inherit' }}>{appliedDaysShort}</span>
        ) : null}
      </span>
    </Tooltip>
  )
}

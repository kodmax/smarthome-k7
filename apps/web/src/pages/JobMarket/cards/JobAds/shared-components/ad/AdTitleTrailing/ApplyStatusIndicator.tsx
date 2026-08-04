import { Tooltip } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { JobAdsFeedItem } from '@repo/types'
import { FC, useMemo } from 'react'
import { useLocale, useTranslations } from '@/i18n'
import { formatApplicationTooltip } from '@/pages/JobMarket/cards/JobAds/components/JobAdsEditView/JobAdsEditAdList/Ad/AdExpandedEditorRow/ApplicationStatusEditor/formatAppliedDaysAgo'
import { formatAppliedDaysShort } from './AppliedDaysPrefix/formatAppliedDaysShort'
import { ApplyStatusIcon } from './ApplyStatusIcon'

export const ApplyStatusIndicator: FC<{ ad: Pick<JobAdsFeedItem, 'meta'> }> = ({ ad }) => {
  const { t } = useTranslations()
  const { locale } = useLocale()
  const labels = t.dashboard.jobAds
  const application = ad.meta.application

  const tooltip = useMemo(() => {
    const statusLabel =
      application.status === 'archived' && application.archiveReason !== null
        ? labels.archiveReason[application.archiveReason]
        : labels.applyStatus[application.status]
    const contentLines = application.comment ? [statusLabel, application.comment] : [statusLabel]

    return formatApplicationTooltip(application.appliedAt, locale, contentLines)
  }, [
    application.appliedAt,
    application.archiveReason,
    application.comment,
    application.status,
    labels.applyStatus,
    labels.archiveReason,
    locale,
  ])

  if (application.status === 'pending-review') {
    return null
  }

  const appliedDaysShort = application.status === 'applied' ? formatAppliedDaysShort(application.appliedAt) : null
  const ariaLabel =
    application.status === 'archived' && application.archiveReason !== null
      ? labels.archiveReason[application.archiveReason]
      : labels.applyStatus[application.status]

  return (
    <Tooltip title={tooltip}>
      <span
        aria-label={ariaLabel}
        style={{
          verticalAlign: 'middle',
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${designTokens.space[1]}px`,
          fontSize: 'inherit',
          lineHeight: 1,
        }}
      >
        <ApplyStatusIcon status={application.status} archiveReason={application.archiveReason} />
        {appliedDaysShort !== null ? (
          <span style={{ color: 'var(--mui-palette-text-secondary)', fontSize: 'inherit' }}>{appliedDaysShort}</span>
        ) : null}
      </span>
    </Tooltip>
  )
}

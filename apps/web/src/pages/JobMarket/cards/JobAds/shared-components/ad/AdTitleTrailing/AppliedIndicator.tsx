import { Tooltip } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { isJobAdApplied, JobAdsFeedItem } from '@repo/types'
import { MailCheck } from 'lucide-react'
import { FC } from 'react'
import { useLocale, useTranslations } from '@/i18n'
import { formatApplicationTooltip } from '@/pages/JobMarket/cards/JobAds/components/JobAdsEditView/JobAdsEditAdList/Ad/AdExpandedEditorRow/ApplicationStatusEditor/formatAppliedDaysAgo'
import { jobTitleIconSize } from '../titleIconSize'
import { APPLY_STATUS_COLORS } from './applyStatusPresentation'
import { formatAppliedDaysShort } from './AppliedDaysPrefix/formatAppliedDaysShort'

export const AppliedIndicator: FC<{ ad: Pick<JobAdsFeedItem, 'meta'> }> = ({ ad }) => {
  const { t } = useTranslations()
  const { locale } = useLocale()
  const labels = t.dashboard.jobAds
  const application = ad.meta.application

  if (!isJobAdApplied(ad) || application.status === 'applied') {
    return null
  }

  const appliedDaysShort = formatAppliedDaysShort(application.appliedAt)
  const tooltip = formatApplicationTooltip(application.appliedAt, locale, [labels.applyStatus.applied])

  return (
    <Tooltip title={tooltip}>
      <span
        aria-label={labels.applyStatus.applied}
        style={{
          verticalAlign: 'middle',
          display: 'inline-flex',
          alignItems: 'center',
          gap: `${designTokens.space[1]}px`,
          fontSize: 'inherit',
          lineHeight: 1,
        }}
      >
        <MailCheck
          size={jobTitleIconSize}
          strokeWidth={designTokens.icon.strokeWidth}
          aria-hidden
          style={{
            color: APPLY_STATUS_COLORS.applied,
            flexShrink: 0,
          }}
        />
        {appliedDaysShort !== null ? (
          <span style={{ color: 'var(--mui-palette-text-secondary)', fontSize: 'inherit' }}>{appliedDaysShort}</span>
        ) : null}
      </span>
    </Tooltip>
  )
}

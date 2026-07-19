import { Tooltip } from '@mui/material'
import { JobAdWithMeta } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { FC, useMemo } from 'react'
import { useTranslations } from '@/i18n'
import { ApplyStatusIcon } from './ApplyStatusIcon'

const iconSize = designTokens.icon.sizeXs - 4

export const ApplyStatusIndicator: FC<{ ad: Pick<JobAdWithMeta, 'meta'> }> = ({ ad }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobs
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

  return (
    <Tooltip title={tooltip}>
      <span
        aria-label={labels.applyStatus[application.status]}
        style={{
          marginRight: `${designTokens.space[1]}px`,
          verticalAlign: 'middle',
          display: 'inline-flex',
        }}
      >
        <ApplyStatusIcon status={application.status} size={iconSize} />
      </span>
    </Tooltip>
  )
}

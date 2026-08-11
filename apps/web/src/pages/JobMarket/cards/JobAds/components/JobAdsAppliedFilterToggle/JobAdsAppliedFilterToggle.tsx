import { IconButton, Tooltip } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { MailCheck } from 'lucide-react'
import { type FC } from 'react'
import { useTranslations } from '@/i18n'
import { APPLY_STATUS_COLORS } from '../../shared-components/ad/AdTitleTrailing/applyStatusPresentation'

type Props = {
  active: boolean
  onToggle: () => void
}

export const JobAdsAppliedFilterToggle: FC<Props> = ({ active, onToggle }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobAds.filters
  const ariaLabel = active ? labels.appliedOnlyActiveLabel : labels.appliedOnlyLabel

  return (
    <Tooltip title={ariaLabel}>
      <IconButton aria-label={ariaLabel} aria-pressed={active} onClick={onToggle} size='small'>
        <MailCheck
          size={designTokens.icon.sizeSm}
          strokeWidth={designTokens.icon.strokeWidth}
          aria-hidden
          style={{
            color: active ? APPLY_STATUS_COLORS.applied : 'var(--mui-palette-text-secondary)',
          }}
        />
      </IconButton>
    </Tooltip>
  )
}

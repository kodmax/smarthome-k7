import { IconButton } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ClipboardPen } from 'lucide-react'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { jobTitleIconSize } from './jobTitleIcons'

export const EditApplicationButton: FC<{
  visible: boolean
  expanded: boolean
  adId: string
  onToggleExpand: (id: string) => void
}> = ({ visible, expanded, adId, onToggleExpand }) => {
  const { t } = useTranslations()
  const labels = t.dashboard.jobs

  if (!visible) {
    return null
  }

  return (
    <IconButton
      aria-label={labels.editApplication}
      aria-expanded={expanded}
      onClick={() => onToggleExpand(adId)}
      size='small'
      sx={{
        verticalAlign: 'middle',
        p: 0,
      }}
    >
      <ClipboardPen size={jobTitleIconSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
    </IconButton>
  )
}

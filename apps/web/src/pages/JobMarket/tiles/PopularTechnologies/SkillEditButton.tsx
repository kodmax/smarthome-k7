import { IconButton } from '@mui/material'
import { designTokens } from '@repo/design-tokens'
import { ClipboardPen } from 'lucide-react'
import { FC } from 'react'
import { useTranslations } from '@/i18n'
import { skillLevelIconDefaultSize } from '@/components/SkillLevelIcon'

export const SkillEditButton: FC<{
  expanded: boolean
  onClick: () => void
}> = ({ expanded, onClick }) => {
  const { t } = useTranslations()
  const label = t.jobMarket.popularTechnologies.editExperience

  return (
    <IconButton aria-label={label} aria-expanded={expanded} onClick={onClick} size='small' sx={{ flexShrink: 0, p: 0 }}>
      <ClipboardPen size={skillLevelIconDefaultSize} strokeWidth={designTokens.icon.strokeWidth} aria-hidden />
    </IconButton>
  )
}

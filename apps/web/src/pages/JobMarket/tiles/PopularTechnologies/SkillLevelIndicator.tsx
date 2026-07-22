import { Tooltip } from '@mui/material'
import { SkillExperienceLevel } from '@repo/types'
import { FC, useMemo } from 'react'
import { useTranslations } from '@/i18n'
import { SkillLevelIcon, skillLevelIconDefaultSize } from '@/components/SkillLevelIcon'

type Props = {
  level: SkillExperienceLevel
  comment: string | null
}

export const SkillLevelIndicator: FC<Props> = ({ level, comment }) => {
  const { t } = useTranslations()
  const labels = t.jobMarket.popularTechnologies

  const tooltip = useMemo(() => {
    const levelLabel = labels.experienceLevel[level]

    if (comment) {
      return `${levelLabel}\n${comment}`
    }

    return levelLabel
  }, [comment, level, labels.experienceLevel])

  return (
    <Tooltip title={tooltip}>
      <span
        aria-label={labels.experienceLevel[level]}
        style={{
          verticalAlign: 'middle',
          display: 'inline-flex',
        }}
      >
        <SkillLevelIcon level={level} size={skillLevelIconDefaultSize} />
      </span>
    </Tooltip>
  )
}

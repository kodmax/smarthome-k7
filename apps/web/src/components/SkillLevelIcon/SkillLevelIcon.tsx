import { SkillExperienceLevel } from '@repo/types'
import { designTokens } from '@repo/design-tokens'
import { FC } from 'react'
import { GradientSkillStarIcon } from './GradientSkillStarIcon'
import { skillLevelIconDefaultSize } from './skillLevelIconDefaultSize'
import {
  MASTER_STAR_GLOW_COLOR,
  MASTER_STAR_GRADIENT_STOPS,
  REGULAR_STAR_GLOW_COLOR,
  REGULAR_STAR_GRADIENT_STOPS,
  SKILL_LEVEL_COLORS,
  SKILL_LEVEL_ICONS,
  isStarSkillLevel,
} from './skillLevelPresentation'

type Props = {
  level: SkillExperienceLevel
  size?: number
}

export const SkillLevelIcon: FC<Props> = ({ level, size = skillLevelIconDefaultSize }) => {
  if (level === 'master') {
    return (
      <GradientSkillStarIcon
        size={size}
        gradientStops={MASTER_STAR_GRADIENT_STOPS}
        glowColor={MASTER_STAR_GLOW_COLOR}
      />
    )
  }

  if (level === 'regular') {
    return (
      <GradientSkillStarIcon
        size={size}
        gradientStops={REGULAR_STAR_GRADIENT_STOPS}
        glowColor={REGULAR_STAR_GLOW_COLOR}
      />
    )
  }

  const Icon = SKILL_LEVEL_ICONS[level]
  const color = SKILL_LEVEL_COLORS[level]

  return (
    <Icon
      size={size}
      strokeWidth={designTokens.icon.strokeWidth}
      aria-hidden
      fill={isStarSkillLevel(level) ? color : 'none'}
      style={{
        color,
        flexShrink: 0,
      }}
    />
  )
}

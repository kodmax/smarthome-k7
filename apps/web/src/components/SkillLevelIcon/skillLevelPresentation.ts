import { designTokens } from '@repo/design-tokens'
import { SkillExperienceLevel } from '@repo/types'
import { Ban, History, Plus, Star, type LucideIcon } from 'lucide-react'

const { skillLevel } = designTokens

export const SKILL_LEVEL_COLORS: Record<SkillExperienceLevel, string> = {
  adept: skillLevel.adept,
  regular: skillLevel.regular.color,
  master: skillLevel.master.color,
  'knew-before': skillLevel.knewBefore.color,
  'to-learn': 'var(--mui-palette-success-main)',
  'not-interested': 'var(--mui-palette-error-main)',
}

export const REGULAR_STAR_GRADIENT_STOPS = skillLevel.regular.gradient
export const REGULAR_STAR_GLOW_COLOR = skillLevel.regular.glow

export const MASTER_STAR_GRADIENT_STOPS = skillLevel.master.gradient
export const MASTER_STAR_GLOW_COLOR = skillLevel.master.glow

export const SKILL_LEVEL_ICONS: Record<SkillExperienceLevel, LucideIcon> = {
  adept: Star,
  regular: Star,
  master: Star,
  'knew-before': History,
  'to-learn': Plus,
  'not-interested': Ban,
}

const STAR_SKILL_LEVELS = new Set<SkillExperienceLevel>(['adept', 'regular', 'master'])

export function isStarSkillLevel(level: SkillExperienceLevel): boolean {
  return STAR_SKILL_LEVELS.has(level)
}

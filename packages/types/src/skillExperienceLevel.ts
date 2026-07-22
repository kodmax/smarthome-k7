export type SkillExperienceLevel = 'master' | 'regular' | 'adept' | 'knew-before' | 'to-learn' | 'not-interested'

export const SKILL_EXPERIENCE_LEVEL_ORDER = [
  'master',
  'regular',
  'adept',
  'knew-before',
  'to-learn',
  'not-interested',
] as const satisfies readonly SkillExperienceLevel[]

const SKILL_EXPERIENCE_LEVELS = new Set<SkillExperienceLevel>(SKILL_EXPERIENCE_LEVEL_ORDER)

export function isSkillExperienceLevel(value: unknown): value is SkillExperienceLevel {
  return typeof value === 'string' && SKILL_EXPERIENCE_LEVELS.has(value as SkillExperienceLevel)
}

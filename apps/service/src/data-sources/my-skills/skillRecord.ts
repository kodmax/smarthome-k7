import { isSkillExperienceLevel, type MySkill } from '@repo/types'
import { captureInvalidInput } from '@/sentry'

export type SkillRecordRow = {
  skill_id: string
  skill_name: string
  experience_level: string
  comment: string | null
}

export function skillRowToMySkill(row: SkillRecordRow): MySkill | null {
  if (!isSkillExperienceLevel(row.experience_level)) {
    captureInvalidInput('my-skills: invalid skill experience level in row', row)
    return null
  }

  return {
    id: row.skill_id,
    name: row.skill_name,
    level: row.experience_level,
    comment: row.comment,
  }
}

export function normalizeSkillComment(comment: string): string | null {
  return comment || null
}

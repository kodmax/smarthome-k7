import { isSkillExperienceLevel, type MySkill, type SkillExperienceLevel } from '@repo/types'

export type SkillRecordRow = {
  skill_id: string
  skill_name: string
  experience_level: string
  comment: string | null
}

export type SetSkillCommandArgs = {
  id: string
  name: string
  level: SkillExperienceLevel
}

export type SetSkillCommentCommandArgs = {
  id: string
  comment: string
}

export function skillRowToMySkill(row: SkillRecordRow): MySkill | null {
  if (!isSkillExperienceLevel(row.experience_level)) {
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

export function parseSetSkillCommandArgs(args: string): SetSkillCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.id !== 'string' || typeof parsed.name !== 'string' || !isSkillExperienceLevel(parsed.level)) {
      return null
    }

    return {
      id: parsed.id,
      name: parsed.name,
      level: parsed.level,
    }
  } catch {
    return null
  }
}

export function parseSetSkillCommentCommandArgs(args: string): SetSkillCommentCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.id !== 'string' || typeof parsed.comment !== 'string') {
      return null
    }

    return {
      id: parsed.id,
      comment: parsed.comment,
    }
  } catch {
    return null
  }
}

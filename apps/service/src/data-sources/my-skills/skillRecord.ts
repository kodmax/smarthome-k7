import { isSkillExperienceLevel, type MySkill, type SkillExperienceLevel } from '@repo/types'
import { captureInvalidInput } from '@/sentry'

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

export function parseSetSkillCommandArgs(args: string): SetSkillCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.id !== 'string' || typeof parsed.name !== 'string' || !isSkillExperienceLevel(parsed.level)) {
      captureInvalidInput('my-skills: invalid set-skill-level command args', args)
      return null
    }

    return {
      id: parsed.id,
      name: parsed.name,
      level: parsed.level,
    }
  } catch (cause) {
    captureInvalidInput('my-skills: failed to parse set-skill-level command args', cause)
    return null
  }
}

export function parseSetSkillCommentCommandArgs(args: string): SetSkillCommentCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.id !== 'string' || typeof parsed.comment !== 'string') {
      captureInvalidInput('my-skills: invalid set-skill-comment command args', args)
      return null
    }

    return {
      id: parsed.id,
      comment: parsed.comment,
    }
  } catch (cause) {
    captureInvalidInput('my-skills: failed to parse set-skill-comment command args', cause)
    return null
  }
}

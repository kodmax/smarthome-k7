import { describe, expect, it } from 'vitest'
import {
  normalizeSkillComment,
  parseSetSkillCommandArgs,
  parseSetSkillCommentCommandArgs,
  skillRowToMySkill,
} from './skillRecord'

describe('skillRecord', () => {
  it('maps valid rows to MySkill', () => {
    expect(
      skillRowToMySkill({
        skill_id: 'typescript',
        skill_name: 'TypeScript',
        experience_level: 'master',
        comment: 'Daily driver',
      }),
    ).toEqual({
      id: 'typescript',
      name: 'TypeScript',
      level: 'master',
      comment: 'Daily driver',
    })
  })

  it('drops rows with invalid experience level', () => {
    expect(
      skillRowToMySkill({
        skill_id: 'typescript',
        skill_name: 'TypeScript',
        experience_level: 'novice',
        comment: null,
      }),
    ).toBeNull()
  })

  it('normalizes empty comment to null', () => {
    expect(normalizeSkillComment('')).toBeNull()
    expect(normalizeSkillComment('Keep me')).toBe('Keep me')
  })

  it('parses set-skill command args', () => {
    expect(
      parseSetSkillCommandArgs(
        JSON.stringify({
          id: 'react',
          name: 'React',
          level: 'regular',
        }),
      ),
    ).toEqual({
      id: 'react',
      name: 'React',
      level: 'regular',
    })
  })

  it('parses set-skill-comment command args', () => {
    expect(parseSetSkillCommentCommandArgs(JSON.stringify({ id: 'react', comment: 'Used at work' }))).toEqual({
      id: 'react',
      comment: 'Used at work',
    })
  })

  it('rejects invalid command args', () => {
    expect(parseSetSkillCommandArgs(JSON.stringify({ id: 'react', name: 'React', level: 'novice' }))).toBeNull()
    expect(parseSetSkillCommentCommandArgs(JSON.stringify({ id: 'react', comment: 123 }))).toBeNull()
    expect(parseSetSkillCommandArgs('not-json')).toBeNull()
  })
})

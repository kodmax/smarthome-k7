import { toSkillId } from '@repo/common'
import { z } from 'zod'

const requiredSkillsSchema = z.array(z.string())

export function parseRequiredSkills(values: unknown): string[] | null {
  const result = requiredSkillsSchema.safeParse(values)
  if (!result.success) {
    return null
  }

  const skills: string[] = []
  const seen = new Set<string>()

  for (const value of result.data) {
    const trimmed = value.trim()
    if (trimmed.length === 0) {
      continue
    }

    const id = toSkillId(trimmed)
    if (seen.has(id)) {
      continue
    }

    seen.add(id)
    skills.push(trimmed)
  }

  return skills
}

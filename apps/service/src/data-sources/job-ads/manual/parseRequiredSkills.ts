import { toSkillId } from '@repo/common'

export function parseRequiredSkills(values: unknown): string[] | null {
  if (!Array.isArray(values)) {
    return null
  }

  const result: string[] = []
  const seen = new Set<string>()

  for (const value of values) {
    if (typeof value !== 'string') {
      return null
    }

    const trimmed = value.trim()
    if (trimmed.length === 0) {
      continue
    }

    const id = toSkillId(trimmed)
    if (seen.has(id)) {
      continue
    }

    seen.add(id)
    result.push(trimmed)
  }

  return result
}

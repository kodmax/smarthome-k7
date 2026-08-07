import { toSkillId } from '@repo/common'
import { JobAdsFeedItem } from '@repo/types'

export function dedupeSkillsById(skills: readonly string[]): string[] {
  const result: string[] = []
  const seen = new Set<string>()

  for (const skill of skills) {
    const trimmed = skill.trim()
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

export function collectSkillSuggestions(ads: JobAdsFeedItem[] | undefined): string[] {
  return dedupeSkillsById((ads ?? []).flatMap(ad => ad.content.requiredSkills)).sort((a, b) => a.localeCompare(b))
}

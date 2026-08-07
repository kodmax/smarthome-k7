import { toSkillId } from '@repo/common'
import { JobAdsFeedItem } from '@repo/types'

export function filterJobAdsByRequiredSkills(
  ads: JobAdsFeedItem[],
  selectedSkills: readonly string[],
): JobAdsFeedItem[] {
  if (selectedSkills.length === 0) {
    return ads
  }

  const requiredIds = selectedSkills.map(toSkillId)

  return ads.filter(ad => {
    const adSkillIds = new Set(ad.content.requiredSkills.map(toSkillId))
    return requiredIds.every(id => adSkillIds.has(id))
  })
}

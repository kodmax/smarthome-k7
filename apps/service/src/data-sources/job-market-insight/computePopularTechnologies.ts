import { isIgnoredSkillKey, normalizeSkillKey, toTechnologyId, unifySkillName } from '@repo/common'
import { JobAd, JobMarketPopularTechnology } from '@repo/types'
import { median } from './median'

export const MIN_POPULAR_TECHNOLOGY_OFFERS = 3

const computeTechnologyMedian = (ads: JobAd[]): number | null => {
  const result = median(
    ads.map(ad => ad.monthlySalaryRangeAfterTaxes?.to).filter((value): value is number => value !== undefined),
  )

  return result === null ? null : Math.round(result)
}

export const computePopularTechnologies = (ads: JobAd[]): JobMarketPopularTechnology[] => {
  if (ads.length === 0) {
    return []
  }

  const adsBySkillKey = new Map<string, { name: string; ads: JobAd[] }>()

  for (const ad of ads) {
    const unifiedSkills = new Map<string, string>()

    for (const skill of ad.requiredSkills) {
      const key = normalizeSkillKey(skill)
      if (isIgnoredSkillKey(key)) {
        continue
      }
      if (!unifiedSkills.has(key)) {
        unifiedSkills.set(key, unifySkillName(skill))
      }
    }

    for (const [key, name] of unifiedSkills) {
      const existing = adsBySkillKey.get(key)
      if (existing === undefined) {
        adsBySkillKey.set(key, { name, ads: [ad] })
        continue
      }

      existing.ads.push(ad)
    }
  }

  const technologies = [...adsBySkillKey.values()]
    .map(({ name, ads: matching }) => ({
      id: toTechnologyId(name),
      name,
      offersCount: matching.length,
      sharePercent: Math.round((matching.length / ads.length) * 100),
      medianSalary: computeTechnologyMedian(matching),
    }))
    .filter(technology => technology.offersCount >= MIN_POPULAR_TECHNOLOGY_OFFERS)
    .sort((a, b) => b.offersCount - a.offersCount || a.name.localeCompare(b.name))

  const seenIds = new Set<string>()
  const duplicateIds = new Set<string>()

  for (const { id } of technologies) {
    if (seenIds.has(id)) {
      duplicateIds.add(id)
      continue
    }
    seenIds.add(id)
  }

  if (duplicateIds.size > 0) {
    throw new Error(`Duplicate popular technology ids: ${[...duplicateIds].join(', ')}`)
  }

  return technologies
}

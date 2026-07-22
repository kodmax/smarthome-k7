import {
  isIgnoredSkillKey,
  normalizeSkillKey,
  filterByPercentileOf,
  toTechnologyId,
  unifySkillName,
} from '@repo/common'
import { JobAd, JobMarketPopularTechnology } from '@repo/types'
import { SALARY_INSIGHT_PERCENTILE } from './computeP90Salary'
import { median } from './median'

export const POPULAR_TECHNOLOGIES_LIMIT = 50
export const POPULAR_TECHNOLOGIES_MIN_OFFERS_COUNT = 2

const computeTechnologyMedian = (ads: JobAd[]): number | null => {
  const result = median(
    ads.map(ad => ad.monthlySalaryRangeAfterTaxes?.to).filter((value): value is number => value !== undefined),
  )

  return result === null ? null : Math.round(result)
}

export const computePopularTechnologies = (ads: JobAd[]): JobMarketPopularTechnology[] => {
  const topPaidAds = filterByPercentileOf(ads, SALARY_INSIGHT_PERCENTILE, ad => ad.monthlySalaryRangeAfterTaxes?.to)
  if (topPaidAds.length === 0) {
    return []
  }

  const adsBySkillKey = new Map<string, { name: string; ads: JobAd[] }>()

  for (const ad of topPaidAds) {
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

  return [...adsBySkillKey.values()]
    .map(({ name, ads: matching }) => ({
      id: toTechnologyId(name),
      name,
      offersCount: matching.length,
      sharePercent: Math.round((matching.length / topPaidAds.length) * 100),
      medianSalary: computeTechnologyMedian(matching),
    }))
    .filter(technology => technology.offersCount >= POPULAR_TECHNOLOGIES_MIN_OFFERS_COUNT)
    .sort((a, b) => b.offersCount - a.offersCount || a.name.localeCompare(b.name))
    .slice(0, POPULAR_TECHNOLOGIES_LIMIT)
}

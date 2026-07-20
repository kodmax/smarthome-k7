import { JobAd, JobMarketPopularTechnology } from '@repo/types'
import { median } from './median'
import { POPULAR_TECHNOLOGIES_LIMIT, TRACKED_TECHNOLOGIES } from './trackedTechnologies'

const adMatchesTechnology = (ad: JobAd, skills: string[]): boolean =>
  ad.requiredSkills.some(skill => skills.includes(skill))

const computeTechnologyMedian = (ads: JobAd[]): number | null => {
  const midpoints = ads.flatMap(ad => {
    const range = ad.monthlySalaryRangeAfterTaxes
    if (range === undefined) {
      return []
    }

    return [(range.from + range.to) / 2]
  })

  const result = median(midpoints)

  return result === null ? null : Math.round(result)
}

export const computePopularTechnologies = (ads: JobAd[]): JobMarketPopularTechnology[] => {
  if (ads.length === 0) {
    return []
  }

  return TRACKED_TECHNOLOGIES.map(({ id, name, skills }) => {
    const matching = ads.filter(ad => adMatchesTechnology(ad, skills))

    return {
      id,
      name,
      offersCount: matching.length,
      sharePercent: Math.round((matching.length / ads.length) * 100),
      medianSalary: computeTechnologyMedian(matching),
    }
  })
    .sort((a, b) => b.offersCount - a.offersCount || a.name.localeCompare(b.name))
    .slice(0, POPULAR_TECHNOLOGIES_LIMIT)
}

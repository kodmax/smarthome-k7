import { toSkillId } from '@repo/common'
import {
  ACCEPTABLE_SALARY_SLIDER_MAX,
  ACCEPTABLE_SALARY_SLIDER_MIN,
  JobAd,
  JobAdsFeedItem,
  JobApplyStatus,
} from '@repo/types'

const SALARY_FILTER_EXEMPT_STATUSES = new Set<JobApplyStatus>(['consider', 'applied', 'interview', 'archived'])

export const shouldFilterJobAdBySalary = (status: JobApplyStatus): boolean => !SALARY_FILTER_EXEMPT_STATUSES.has(status)

export const hasNotInterestedRequiredSkill = (
  requiredSkills: string[],
  notInterestedSkillIds: ReadonlySet<string>,
): boolean => requiredSkills.some(skill => notInterestedSkillIds.has(toSkillId(skill)))

export const filterJobAdsByNotInterestedSkills = <T extends { requiredSkills: string[] }>(
  items: T[],
  notInterestedSkillIds: ReadonlySet<string>,
): T[] => {
  if (notInterestedSkillIds.size === 0) {
    return items
  }

  return items.filter(item => !hasNotInterestedRequiredSkill(item.requiredSkills, notInterestedSkillIds))
}

export const filterJobAdsFeedItemsByNotInterestedSkills = (
  items: JobAdsFeedItem[],
  notInterestedSkillIds: ReadonlySet<string>,
): JobAdsFeedItem[] => {
  if (notInterestedSkillIds.size === 0) {
    return items
  }

  return items.filter(item => !hasNotInterestedRequiredSkill(item.content.requiredSkills, notInterestedSkillIds))
}

export const isSalaryAboveThreshold = (ad: JobAd, threshold: number): boolean => {
  const effectiveTo = ad.monthlySalaryRangeAfterTaxes?.to ?? 0

  if (threshold <= ACCEPTABLE_SALARY_SLIDER_MIN) {
    return true
  }

  if (threshold >= ACCEPTABLE_SALARY_SLIDER_MAX) {
    return effectiveTo >= ACCEPTABLE_SALARY_SLIDER_MAX
  }

  return effectiveTo >= threshold
}

export const filterJobAdsByAcceptableSalary = (
  ads: JobAdsFeedItem[],
  acceptableSalary: number | null,
): JobAdsFeedItem[] => {
  if (acceptableSalary === null) {
    return ads
  }

  return ads.filter(item => {
    if (!shouldFilterJobAdBySalary(item.meta.application.status)) {
      return true
    }

    return isSalaryAboveThreshold(item.content, acceptableSalary)
  })
}

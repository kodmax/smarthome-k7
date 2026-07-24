import { Feeds } from '@repo/apollo-ws'
import { toSkillId } from '@repo/common'
import { JobAdsFeed } from '@repo/types'
import { JobAdsSource, MySkillsSource } from '@/data-sources'

export const addJobAdsFeed = (feeds: Feeds): Promise<void> =>
  feeds.addFeed('job-ads', { jobAds: JobAdsSource, mySkills: MySkillsSource }, ({ jobAds, mySkills }): JobAdsFeed => {
    const notInterested = new Set(
      mySkills.skills.filter(skill => skill.level === 'not-interested').map(skill => skill.id),
    )

    return {
      ads: jobAds.ads.filter(ad => !ad.requiredSkills.some(skill => notInterested.has(toSkillId(skill)))),
      salaryRange: jobAds.salaryRange,
      acceptableSalary: jobAds.acceptableSalary,
    }
  })

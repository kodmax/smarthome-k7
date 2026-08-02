import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { toSkillId } from '@repo/common'
import { JobAdsFeed } from '@repo/types'
import { DataSourceRegistryType } from '@/data-sources'

export const addJobAdsFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.registerFeed('job-ads', dataSources.getByIds(['jobAds', 'mySkills']), ({ jobAds, mySkills }): JobAdsFeed => {
    const notInterested = new Set(
      mySkills.skills.filter(skill => skill.level === 'not-interested').map(skill => skill.id),
    )

    return {
      ads: jobAds.ads.filter(item => !item.content.requiredSkills.some(skill => notInterested.has(toSkillId(skill)))),
      salaryRange: jobAds.salaryRange,
      acceptableSalary: jobAds.acceptableSalary,
    }
  })

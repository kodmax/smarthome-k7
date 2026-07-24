import { Feeds } from '@repo/apollo-ws'
import { toSkillId } from '@repo/common'
import { JobsFeed } from '@repo/types'
import { JobsSource, MySkillsSource } from '@/data-sources'

export const addJobsFeed = (feeds: Feeds): Promise<void> =>
  feeds.addFeed('jobs', { jobs: JobsSource, mySkills: MySkillsSource }, ({ jobs, mySkills }): JobsFeed => {
    const notInterested = new Set(
      mySkills.skills.filter(skill => skill.level === 'not-interested').map(skill => skill.id),
    )

    return {
      ads: jobs.ads.filter(ad => !ad.requiredSkills.some(skill => notInterested.has(toSkillId(skill)))),
    }
  })

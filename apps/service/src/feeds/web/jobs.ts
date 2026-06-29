import { Feeds } from '@repo/apollo-ws'
import { JobsFeed } from '@repo/types'
import { jobs } from '@/data-sources'

export const addJobsFeed = (feeds: Feeds): Promise<void> =>
  feeds.addFeed('jobs', { jobs }, ({ jobs }): JobsFeed => jobs)

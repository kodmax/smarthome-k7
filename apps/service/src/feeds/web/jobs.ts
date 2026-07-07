import { Feeds } from '@repo/apollo-ws'
import { JobsSource } from '@/data-sources'

export const addJobsFeed = (feeds: Feeds): Promise<void> => feeds.addFeed('jobs', { jobs: JobsSource })

import { Feeds } from '@repo/apollo-ws'
import { JobMarketInsightSource } from '@/data-sources'

export const addJobMarketInsightFeed = (feeds: Feeds): Promise<void> =>
  feeds.addFeed('job-market-insight', { jobMarketInsight: JobMarketInsightSource })

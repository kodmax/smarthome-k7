import { FeedManager } from '@repo/feeds'
import { JobMarketInsightSource } from '@/data-sources'

export const addJobMarketInsightFeed = (feeds: FeedManager): Promise<void> =>
  feeds.addFeed('job-market-insight', { jobMarketInsight: JobMarketInsightSource })

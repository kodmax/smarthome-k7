import { FeedManager } from '@repo/feeds'
import { NewsSource } from '@/data-sources'

export const addNewsFeed = (feeds: FeedManager): Promise<void> => feeds.addFeed('news', { news: NewsSource })

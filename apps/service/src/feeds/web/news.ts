import { Feeds } from '@repo/apollo-ws'
import { news } from '@/data-sources'

export const addNewsFeed = (feeds: Feeds): Promise<void> => feeds.addFeed('news', { news })

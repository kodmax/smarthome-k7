import { Feeds } from '@repo/apollo-ws'
import { news } from '../data-sources'

export const addNewsFeed = (feeds: Feeds): void => {
  feeds.addFeed('news', { news })
}

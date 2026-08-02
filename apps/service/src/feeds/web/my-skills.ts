import { FeedManager } from '@repo/feeds'
import { MySkillsSource } from '@/data-sources'

export const addMySkillsFeed = (feeds: FeedManager): Promise<void> =>
  feeds.addFeed('my-skills', { mySkills: MySkillsSource })

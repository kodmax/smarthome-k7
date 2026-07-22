import { Feeds } from '@repo/apollo-ws'
import { MySkillsSource } from '@/data-sources'

export const addMySkillsFeed = (feeds: Feeds): Promise<void> => feeds.addFeed('my-skills', { mySkills: MySkillsSource })

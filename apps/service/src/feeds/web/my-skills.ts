import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addMySkillsFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => feeds.registerFeed('my-skills', dataSources.getByIds(['mySkills']), ({ mySkills }) => mySkills)

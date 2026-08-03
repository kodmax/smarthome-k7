import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addMySkillsFeed = (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => feeds.addFeed('my-skills', dataSources.getByIds(['mySkills']), ({ mySkills }) => mySkills)

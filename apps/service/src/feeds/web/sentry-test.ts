import { DataSourceRegistry, FeedManager } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addSentryTestFeed = (
  feeds: FeedManager,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => feeds.addFeed('sentry-test', dataSources.getByIds(['sentryTest']), ({ sentryTest }) => sentryTest)

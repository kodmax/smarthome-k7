import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { DataSourceRegistryType } from '@/data-sources'

export const addSentryTestFeed = (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => feeds.addFeed('sentry-test', dataSources.getByIds(['sentryTest']), ({ sentryTest }) => sentryTest)

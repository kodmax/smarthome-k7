import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { JobAdsFeed } from '@repo/types'
import { DataSourceRegistryType } from '@/data-sources'

export const addJobAdsFeed = (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> =>
  feeds.addFeed('job-ads', dataSources.getByIds(['jobAds']), ({ jobAds }): JobAdsFeed => {
    return {
      ads: jobAds.ads,
      acceptableSalary: jobAds.acceptableSalary,
    }
  })

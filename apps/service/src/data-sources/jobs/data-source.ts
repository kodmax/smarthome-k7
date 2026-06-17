import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { jjit } from './jjit/jjit'
import { JobAd, JobsFeed } from '@repo/types'
import { nfj } from './nfj/nfj'
import { addAds } from './filters'

export const source: DataSourceDefinition<JobsFeed> = {
  cron: '0 8 * * *',
  id: 'jobs',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 15,
  script: async () => {
    const allAds = new Map<string, JobAd>()

    addAds(allAds, await jjit())
    addAds(allAds, await nfj())
    // addAds(allAds, await theprotocol())

    return {
      ads: [...allAds.values()].sort(
        (a, b) => (b.monthlySalaryRangeAfterTaxes?.to ?? 0) - (a.monthlySalaryRangeAfterTaxes?.to ?? 0),
      ),
    }
  },
}

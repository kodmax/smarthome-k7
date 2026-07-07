import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { jjit } from './jjit/jjit'
import { JobAd, JobsFeed } from '@repo/types'
import { nfj } from './nfj/nfj'
import { addAds } from './filters'

export class JobsSource extends DataSourceDefinition<JobsFeed> {
  getId() {
    return 'jobs'
  }

  getCron() {
    return '0 8 * * *'
  }

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.MINUTES) > 15
  }

  async getData() {
    const allAds = new Map<string, JobAd>()

    addAds(allAds, await jjit())
    addAds(allAds, await nfj())
    // addAds(allAds, await theprotocol())

    return {
      ads: [...allAds.values()].sort(
        (a, b) => (b.monthlySalaryRangeAfterTaxes?.to ?? 0) - (a.monthlySalaryRangeAfterTaxes?.to ?? 0),
      ),
    }
  }
}

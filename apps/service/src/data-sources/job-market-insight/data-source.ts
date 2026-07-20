import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { JobAd, JobMarketInsightCachedFeed, JobMarketInsightFeed } from '@repo/types'
import { jjit } from '../jobs/jjit/jjit'
import { nfj } from '../jobs/nfj/nfj'
import { theprotocol } from '../jobs/theprotocol'
import { addAllAds } from './addAllAds'
import { computeMedianSalary } from './computeMedianSalary'
import { computeOffersWithSalaryRangePercent } from './computeOffersWithSalaryRangePercent'
import { computePermanentEmploymentPercent } from './computePermanentEmploymentPercent'
import { computePopularTechnologies } from './computePopularTechnologies'
import { computeRemoteWorkPercent } from './computeRemoteWorkPercent'
import { countNewOffers } from './countNewOffers'

export class JobMarketInsightSource extends DataSourceDefinition<JobMarketInsightFeed, JobMarketInsightCachedFeed> {
  getId() {
    return 'job-market-insight'
  }

  getCron() {
    return '0 8 * * *'
  }

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.MINUTES) > 15
  }

  async getData() {
    const allAds = new Map<string, JobAd>()

    addAllAds(allAds, await jjit())
    addAllAds(allAds, await nfj())
    addAllAds(allAds, await theprotocol())

    return {
      ads: [...allAds.values()],
    }
  }

  async composeContent(cached: JobMarketInsightCachedFeed): Promise<JobMarketInsightFeed> {
    return {
      adsCount: cached.ads.length,
      newOffersCount: countNewOffers(cached.ads),
      medianSalary: computeMedianSalary(cached.ads),
      offersWithSalaryRangePercent: computeOffersWithSalaryRangePercent(cached.ads),
      remoteWorkPercent: computeRemoteWorkPercent(cached.ads),
      permanentEmploymentPercent: computePermanentEmploymentPercent(cached.ads),
      popularTechnologies: computePopularTechnologies(cached.ads),
    }
  }
}

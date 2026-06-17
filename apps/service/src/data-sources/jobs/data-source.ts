import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { jjit } from './jjit/jjit'
import { isHybridOrRemote, isSalaryAcceptable, noManager, noUwantedSkills, withReact } from './filters'
import { JobAd, JobsFeed } from '@repo/types'
import { nfj } from './nfj/nfj'

export const source: DataSourceDefinition<JobsFeed> = {
  cron: '0 8 * * *',
  id: 'jobs',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 15,
  script: async () => {
    const allAds = new Map<string, JobAd>()

    const jjAds = (await jjit())
      .filter(noUwantedSkills)
      .filter(isSalaryAcceptable)
      .filter(isHybridOrRemote)
      .filter(noManager)
      .filter(withReact)
    
    for (const ad of jjAds) {
      const uid = `${ad.companyName.toLocaleLowerCase()} -- ${ad.title.toLocaleUpperCase()}`
      if (!allAds.has(uid)) {
        allAds.set(uid, ad)
      }
    }

    const nfjAds = (await nfj())
      .filter(noUwantedSkills)
      .filter(isSalaryAcceptable)
      .filter(isHybridOrRemote)
      .filter(noManager)
      .filter(withReact)
    
    for (const ad of nfjAds) {
      const uid = `${ad.companyName.toLocaleLowerCase()} -- ${ad.title.toLocaleUpperCase()}`
      if (!allAds.has(uid)) {
        allAds.set(uid, ad)
      }
    }

    return {
      ads: [...allAds.values()].sort(
        (a, b) => (b.monthlySalaryRangeAfterTaxes?.to ?? 0) - (a.monthlySalaryRangeAfterTaxes?.to ?? 0),
      ),
    }
  },
}

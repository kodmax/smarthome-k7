import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { jjit } from './jjit'
import { isRemote, isSalaryAcceptable, noManager, noUwantedSkills } from './filters'
import { JobAd, JobsData } from '@repo/types'
import { nfj } from './nfj/nfj'

export const source: DataSourceDefinition<JobsData> = {
  cron: '0 8 * * *',
  id: 'jobs',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 15,
  script: async () => {
    const allAds = new Map<string, JobAd>()

    const jjAds = (await jjit()).filter(noUwantedSkills).filter(isSalaryAcceptable).filter(isRemote).filter(noManager)
    for (const ad of jjAds) {
      const uid = `${ad.companyName.toLocaleLowerCase()} -- ${ad.title.toLocaleUpperCase()}`
      if (!allAds.has(uid)) {
        allAds.set(uid, ad)
      }
    }

    const nfjAds = (await nfj()).filter(noUwantedSkills).filter(isSalaryAcceptable).filter(isRemote).filter(noManager)
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

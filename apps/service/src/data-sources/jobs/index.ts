import { CacheAgeUnit, DataSourceDefinition } from 'apollo-ws'
import { jjit } from './jjit'
import { isRemote, isSalaryAcceptable, noUwantedSkills } from './filters'
import { JobAd, JobsData } from '@repo/types'
import { nfj } from './nfj'

// export type FXRates = {
//   'EUR/PLN': string
//   'USD/PLN': string
// }

export const source: DataSourceDefinition<JobsData> = {
  cron: '0 8 * * *',
  id: 'jobs',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 15,
  script: async () => {
    // const [eur, usd] = await Promise.all([
    //   myFetch('https://pl.investing.com/currencies/eur-pln', { accept: 'text/html' })
    //     .then(response => response.toString('utf-8'))
    //     .then(html => {
    //       return getTextContent(parseHTML(html).window.document.body, '[data-test=instrument-price-last]')
    //     }),
    //   myFetch('https://pl.investing.com/currencies/usd-pln', { accept: 'text/html' })
    //     .then(response => response.toString('utf-8'))
    //     .then(html => {
    //       return getTextContent(parseHTML(html).window.document.body, '[data-test=instrument-price-last]')
    //     }),
    // ])

    // const rates: FXRates = {
    //   'EUR/PLN': Number(eur).toFixed(4),
    //   'USD/PLN': Number(usd).toFixed(4),
    // }

    const allAds = new Map<string, JobAd>()

    const jjAds = (await jjit()).filter(noUwantedSkills).filter(isSalaryAcceptable).filter(isRemote)
    for (const ad of jjAds) {
      const uid = `${ad.companyName.toLocaleLowerCase()} -- ${ad.title.toLocaleUpperCase()}`
      if (!allAds.has(uid)) {
        allAds.set(uid, ad)
      }
    }

    const nfjAds = (await nfj()).filter(noUwantedSkills).filter(isSalaryAcceptable).filter(isRemote)
    for (const ad of nfjAds) {
      const uid = `${ad.companyName.toLocaleLowerCase()} -- ${ad.title.toLocaleUpperCase()}`
      if (!allAds.has(uid)) {
        allAds.set(uid, ad)
      }
    }
    // const top20 = jj.slice(0, Math.floor(0.2 * jj.length))
    // const middle = jj[Math.floor(jj.length / 2)]
    // const salaries = {
    //   top20: Math.round(top20.reduce((sum, offer) => sum + offer.salary.plnTo, 0) / top20.length),
    //   median: Math.round(middle.salary.plnFrom + middle.salary.plnTo) / 2,
    // }
    // const minSalary = salaries.top20 * 0.8
    // const offers = jj //.concat(await nfj(minSalary))
    // const myList = offers.filter(
    //   offer =>
    //     offer.salary.plnTo > minSalary &&
    //     offer.salary.plnFrom > minSalary * 0.8 &&
    //     !noUnwantedCompanies(offer.company_name),
    // )

    // const conn = await db.getConnection()
    // try {
    //   const timeWindow = new DateTime(-365, CacheAgeUnit.DAYS).getDateTime()
    //   const now = new DateTime().getDateTime()

    //   await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [
    //     now,
    //     'salaries:median/kPLN',
    //     salaries.median,
    //   ])
    //   await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [
    //     now,
    //     'salaries:top20/kPLN',
    //     salaries.top20,
    //   ])

    //   const history: History = {
    //     top20: await conn.query(
    //       'select price as amount, datetime from commodities where name=? and datetime >= ? order by datetime; ',
    //       ['salaries:top20/kPLN', timeWindow],
    //     ),
    //     median: await conn.query(
    //       'select price as amount, datetime from commodities where name=? and datetime >= ? order by datetime; ',
    //       ['salaries:median/kPLN', timeWindow],
    //     ),
    //   }

    // } finally {
    //   await conn.end()
    // }

    return {
      ads: [...allAds.values()].sort(
        (a, b) => (b.monthlySalaryRangeAfterTaxes?.to ?? 0) - (a.monthlySalaryRangeAfterTaxes?.to ?? 0),
      ),
      // salaries,
      // history,
    }
  },
}

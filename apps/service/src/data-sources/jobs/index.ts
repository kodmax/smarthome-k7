import { CacheAgeUnit, DataSourceDefinition } from 'apollo-ws'
import { JSDOM } from 'jsdom'
import { myFetch } from '../../fetch'
import { getTextContent } from '../utils/get-text-context'
import { jjit } from './jjit'
import DateTime from '../../DateTime'
import db from '../../db'
import { nfj } from './nfj'
import { noUnwantedCompanies } from './filters'

export type FXRates = {
  'EUR/PLN': string
  'USD/PLN': string
}

export type PlnSalary = {
  plnFrom: number
  plnTo: number
}

export type Skill = {
  name: string
  level: number
}

export type Job = {
  advert_url: string
  salary: PlnSalary
  title: string
  id: string

  company_logo_url: string
  company_name: string
  skills: Skill[]
}

type Salaries = {
  median: number
  top20: number
}

type Record = {
  datetime: string
  amount: number
}

type History = {
  [k in keyof Salaries]: Record[]
}

type JobsOffers = {
  list: Job[]
  salaries: Salaries
  history: History
}

export const source: DataSourceDefinition<JobsOffers> = {
  cron: '0 8 * * *',
  id: 'jobs',

  expired: snapshot => snapshot.age(CacheAgeUnit.MINUTES) > 15,
  script: async () => {
    const [eur, usd] = await Promise.all([
      myFetch('https://pl.investing.com/currencies/eur-pln', { accept: 'text/html' })
        .then(response => response.toString('utf-8'))
        .then(html => {
          return getTextContent(new JSDOM(html).window.document.body, '.text-2xl[data-test=instrument-price-last]')
        }),
      myFetch('https://pl.investing.com/currencies/usd-pln', { accept: 'text/html' })
        .then(response => response.toString('utf-8'))
        .then(html => {
          return getTextContent(new JSDOM(html).window.document.body, '.text-2xl[data-test=instrument-price-last]')
        }),
    ])

    const rates: FXRates = {
      'EUR/PLN': Number(eur).toFixed(4),
      'USD/PLN': Number(usd).toFixed(4),
    }

    const jj = await jjit(rates)
    const top20 = jj.slice(0, Math.floor(0.2 * jj.length))
    const middle = jj[Math.floor(jj.length / 2)]
    const salaries = {
      top20: Math.round(top20.reduce((sum, offer) => sum + offer.salary.plnTo, 0) / top20.length),
      median: Math.round(middle.salary.plnFrom + middle.salary.plnTo) / 2,
    }

    const conn = await db.getConnection()
    try {
      const timeWindow = new DateTime(-365, CacheAgeUnit.DAYS).getDateTime()
      const now = new DateTime().getDateTime()

      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [
        now,
        'salaries:median/kPLN',
        salaries.median,
      ])
      await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [
        now,
        'salaries:top20/kPLN',
        salaries.top20,
      ])

      const history: History = {
        top20: await conn.query(
          'select price as amount, datetime from commodities where name=? and datetime >= ? order by datetime; ',
          ['salaries:top20/kPLN', timeWindow],
        ),
        median: await conn.query(
          'select price as amount, datetime from commodities where name=? and datetime >= ? order by datetime; ',
          ['salaries:median/kPLN', timeWindow],
        ),
      }

      const minSalary = salaries.top20 * 0.8
      const offers = jj.concat(await nfj(minSalary))
      const myList = offers.filter(
        offer =>
          offer.salary.plnTo > minSalary &&
          offer.salary.plnFrom > minSalary * 0.8 &&
          !noUnwantedCompanies(offer.company_name),
      )

      return {
        list: myList.sort((a, b) => b.salary.plnTo - a.salary.plnTo),
        salaries,
        history,
      }
    } finally {
      await conn.end()
    }
  },
}

export type { JobsOffers }

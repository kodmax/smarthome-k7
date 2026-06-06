import { CacheAgeUnit, DataSourceDefinition } from 'apollo-ws'
import { JSDOM } from 'jsdom'
import DateTime from '../DateTime'
import db from '../db'
import { myFetch } from '../fetch'
import { getTextContent } from './utils/get-text-context'

type Price = {
  current: number
  history: Array<{
    datetime: string
    price: string
  }>
}

type FuelPrices = {
  [k: string]: Price
}

export const source: DataSourceDefinition<FuelPrices> = {
  cron: '0 10 * * *',
  id: 'fossil-fuels',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 24,
  script: async () => {
    return await myFetch('https://www.autocentrum.pl/paliwa/ceny-paliw/mazowieckie/')
      .then(content => new JSDOM(content.toString('utf8')).window.document)
      .then(async (document: Document) => {
        const current = Object.fromEntries(
          Array.from(document.querySelectorAll('.fuels-wrapper .station-detail-wrapper')).map(price => {
            return [
              getTextContent(price, '.fuel-header').trim(),
              +getTextContent(price, '.price')
                .trim()
                .replace(/\s*zł$/, '')
                .replace(',', '.'),
            ]
          }),
        )

        const timeWindow = new DateTime(-30, CacheAgeUnit.DAYS).getDateTime()
        const now = new DateTime().getDateTime()
        const conn = await db.getConnection()

        const prices: FuelPrices = {}
        try {
          for (const type of Object.keys(current)) {
            await conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [
              now,
              type,
              current[type],
            ])

            prices[type] = {
              history: await conn.query(
                'select datetime, price from commodities where name = ? and datetime >= ? order by datetime',
                [type, timeWindow],
              ),
              current: current[type],
            }
          }
        } finally {
          await conn.end()
        }

        return prices
      })
  },
}

export type { FuelPrices }

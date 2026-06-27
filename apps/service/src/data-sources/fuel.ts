import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'
import { getHTML } from '@/fetch'
import { getTextContent } from './utils/get-text-context'
import { FuelPricesFeed } from '@repo/types'

export const source: DataSourceDefinition<FuelPricesFeed> = {
  cron: '0 10 * * *',
  id: 'fossil-fuels',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 24,
  script: async () => {
    return await getHTML('https://www.autocentrum.pl/paliwa/ceny-paliw/mazowieckie/').then(
      async (document: Document) => {
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

        const prices: FuelPricesFeed = {}
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
          conn.release()
        }

        return prices
      },
    )
  },
}

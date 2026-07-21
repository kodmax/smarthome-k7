import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import { fetchDocument } from '@/fetch'
import { getTextContent } from '@/utils/get-text-context'
import { FuelPricesFeed } from '@repo/types'

export class FuelSource extends DataSourceDefinition<FuelPricesFeed> {
  @Inject('db')
  declare private db: Pool
  getId() {
    return 'fossil-fuels'
  }

  getCron() {
    return '0 10 * * *'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  async getData() {
    return await fetchDocument('https://www.autocentrum.pl/paliwa/ceny-paliw/mazowieckie/').then(
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

        const timeWindow = DateTime.shift(-30, DateTime.DAY).getDateTime()
        const now = DateTime.now().getDateTime()
        const conn = await this.db.getConnection()

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
  }
}

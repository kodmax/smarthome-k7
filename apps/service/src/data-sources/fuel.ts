import { CacheAgeUnit, DataSource } from '@repo/feeds'
import DateTime from '../DateTime'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { getTextContent } from '@/utils/get-text-context'
import { FuelPricesFeed } from '@repo/types'

export class FuelSource extends DataSource<FuelPricesFeed> {
  @Inject('db')
  declare private db: Pool

  static getId() {
    return 'fossil-fuels'
  }

  static getCron() {
    return '0 10 * * *'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  protected getSourceMetricType() {
    return 'scraper' as const
  }

  protected async fetchData() {
    const url = 'https://www.autocentrum.pl/paliwa/ceny-paliw/mazowieckie/'
    const document = await observeHttpFetch(url, 'html', () => fetchDocument(url))

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
        await observeDbQuery('insert', 'commodities', () =>
          conn.query('insert into commodities (datetime, name, price) values (?, ?, ?)', [now, type, current[type]]),
        )

        prices[type] = {
          history: await observeDbQuery('select', 'commodities', () =>
            conn.query('select datetime, price from commodities where name = ? and datetime >= ? order by datetime', [
              type,
              timeWindow,
            ]),
          ),
          current: current[type],
        }
      }
    } finally {
      conn.release()
    }

    return prices
  }
}

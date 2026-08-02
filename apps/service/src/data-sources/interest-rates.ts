import { CacheAgeUnit, DataSourceDefinition } from '@repo/feeds'
import DateTime from '../DateTime'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { INTEREST_RATES, InterestRateData, InterestRatesFeed } from '@repo/types'
import { parseNbpRatesFromDocument, parseWiborFromHtml } from './interest-rates/parse'

export class InterestRatesSource extends DataSourceDefinition<InterestRatesFeed> {
  @Inject('db')
  declare private db: Pool
  getId() {
    return 'interest-rates'
  }

  getCron() {
    return '5 11,17 * * 1-5'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 12
  }

  getSourceMetricType() {
    return 'scraper' as const
  }

  async getData() {
    const wiborUrl = 'https://www.bankier.pl/mieszkaniowe/stopy-procentowe/wibor'
    const wiborDocument = await observeHttpFetch(wiborUrl, 'html', () =>
      fetchDocument(wiborUrl, { accept: 'text/html' }),
    )
    const wibor = parseWiborFromHtml(wiborDocument.documentElement.outerHTML)

    const nbpUrl = 'https://nbp.pl/polityka-pieniezna/decyzje-rpp/podstawowe-stopy-procentowe-nbp/'
    const nbpDocument = await observeHttpFetch(nbpUrl, 'html', () => fetchDocument(nbpUrl, { accept: 'text/html' }))
    const nbp = parseNbpRatesFromDocument(nbpDocument)

    const timeWindow = DateTime.shift(-30, DateTime.DAY).getDateTime()
    const now = DateTime.now().getDateTime()
    const conn = await this.db.getConnection()

    try {
      const irs: Record<string, InterestRateData> = {}
      const data = { ...wibor, ...nbp }
      for (const name of Object.keys(INTEREST_RATES) as Array<keyof typeof INTEREST_RATES>) {
        await observeDbQuery('insert', 'interest_rates', () =>
          conn.query('insert into interest_rates (datetime, name, rate) values (?, ?, ?)', [
            now,
            name,
            data[INTEREST_RATES[name]].ir,
          ]),
        )

        irs[name] = {
          history: await observeDbQuery('select', 'interest_rates', () =>
            conn.query('select datetime, rate from interest_rates where name = ? and datetime >= ? order by datetime', [
              name,
              timeWindow,
            ]),
          ),
          current: data[INTEREST_RATES[name]].ir,
        }
      }

      return irs as InterestRatesFeed
    } finally {
      conn.release()
    }
  }
}

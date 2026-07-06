import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'
import { fetchDocument } from '@/fetch'
import { INTEREST_RATES, InterestRateData, InterestRatesFeed } from '@repo/types'
import { parseNbpRatesFromDocument, parseWiborFromHtml } from './interest-rates/parse'

export const source: DataSourceDefinition<InterestRatesFeed> = {
  cron: '5 11,17 * * 1-5',
  id: 'interest-rates',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 12,
  script: async () => {
    const wibor = await fetchDocument('https://www.bankier.pl/mieszkaniowe/stopy-procentowe/wibor', {
      accept: 'text/html',
    }).then(document => parseWiborFromHtml(document.documentElement.outerHTML))

    const nbp = await fetchDocument('https://nbp.pl/polityka-pieniezna/decyzje-rpp/podstawowe-stopy-procentowe-nbp/', {
      accept: 'text/html',
    }).then(parseNbpRatesFromDocument)

    const timeWindow = DateTime.shift(-30, CacheAgeUnit.DAYS).getDateTime()
    const now = DateTime.now().getDateTime()
    const conn = await db.getConnection()

    try {
      const irs: Record<string, InterestRateData> = {}
      const data = { ...wibor, ...nbp }
      for (const name of Object.keys(INTEREST_RATES) as Array<keyof typeof INTEREST_RATES>) {
        await conn.query('insert into interest_rates (datetime, name, rate) values (?, ?, ?)', [
          now,
          name,
          data[INTEREST_RATES[name]].ir,
        ])

        irs[name] = {
          history: await conn.query(
            'select datetime, rate from interest_rates where name = ? and datetime >= ? order by datetime',
            [name, timeWindow],
          ),
          current: data[INTEREST_RATES[name]].ir,
        }
      }

      return irs as InterestRatesFeed
    } finally {
      conn.release()
    }
  },
}

import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import DateTime from '../DateTime'
import db from '../db'
import { fetchDocument } from '@/fetch'
import { getTextContent } from './utils/get-text-context'
import { INTEREST_RATES, InterestRateData, InterestRatesFeed } from '@repo/types'

// eslint-disable-next-line max-len
const irPattern =
  /<tr>\s*<td><a href="wibor\?rateDate=&rateChartType=..">(WIBOR ..)[<>/a-z ]+\s*<\/td>\s*<td class="[a-zA-Z -]+">\s*(-?\d+,\d+)%\s*\((-?\d+,\d+)\)/g
const datePattern = /<td>Data<\/td>\s*<td class="textBold">(\d\d\d\d-\d\d-\d\d)<\/td>/

export const source: DataSourceDefinition<InterestRatesFeed> = {
  cron: '5 11,17 * * 1-5',
  id: 'interest-rates',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 12,
  script: async () => {
    const wibor = await fetchDocument('https://www.bankier.pl/mieszkaniowe/stopy-procentowe/wibor', {
      accept: 'text/html',
    }).then(async document => {
      const html = document.documentElement.outerHTML
      const rates = [...html.matchAll(irPattern)].map(match => ({
        period: match[1],
        interestRate: match[2].replace(',', '.'),
        delta: match[3].replace(',', '.'),
      }))
      const dateMatch = html.match(datePattern)

      const date = dateMatch === null ? '' : dateMatch[1]
      return {
        ...Object.fromEntries(rates.map(rate => [rate.period, { ir: rate.interestRate, delta: rate.delta, date }])),
      }
    })

    const nbp = await fetchDocument('https://nbp.pl/polityka-pieniezna/decyzje-rpp/podstawowe-stopy-procentowe-nbp/', {
      accept: 'text/html',
    }).then(async document => {
      return Object.fromEntries(
        Array.from(document.querySelectorAll('table.nbptable tr'))
          .map(tr => Array.from(tr.children))
          .map(([name, value, date]) => [
            getTextContent(name).trim(),
            {
              ir: getTextContent(value).trim().replace(',', '.'),
              date: getTextContent(date).trim(),
            },
          ]),
      )
    })

    const timeWindow = new DateTime(-30, CacheAgeUnit.DAYS).getDateTime()
    const now = new DateTime().getDateTime()
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

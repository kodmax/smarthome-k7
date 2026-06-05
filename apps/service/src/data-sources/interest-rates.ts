import { CacheAgeUnit, DataSourceDefinition } from 'apollo-ws'
import { JSDOM } from 'jsdom'
import DateTime from '../DateTime'
import db from '../db'
import { myFetch } from '../fetch'
import { getTextContent } from './utils/get-text-context'

enum INTEREST_RATES {
    'NBP Ref.' = 'Stopa referencyjna 1)',
    'WIBOR 1M' = 'WIBOR 1M',
    'WIBOR 3M' = 'WIBOR 3M',
    'WIBOR 6M' = 'WIBOR 6M'
}

type IRS = {
    -readonly [K in keyof typeof INTEREST_RATES]?: {
        current: string
        history: Array<{
            datetime: string
            rate: string
        }>
    }
}

// eslint-disable-next-line max-len
const irPattern = /<tr>\s*<td><a href="wibor\?rateDate=&rateChartType=..">(WIBOR ..)[<>/a-z ]+\s*<\/td>\s*<td class="[a-zA-Z -]+">\s*(-?\d+,\d+)%\s*\((-?\d+,\d+)\)/g
const datePattern = /<td>Data<\/td>\s*<td class="textBold">(\d\d\d\d-\d\d-\d\d)<\/td>/

export const source: DataSourceDefinition<IRS> = {
    cron: '5 11,17 * * 1-5',
    id: 'interest-rates',

    expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 12,
    script: async () => {

        const wibor = await myFetch('https://www.bankier.pl/mieszkaniowe/stopy-procentowe/wibor', { accept: 'text/html' })
            .then(resp => resp.toString('utf-8')).then(async html => {
                const rates = [...html.matchAll(irPattern)].map(match => ({
                    period: match[1],
                    interestRate: match[2].replace(',', '.'),
                    delta: match[3].replace(',', '.')
                }))
                const dateMatch = html.match(datePattern)

                const date = dateMatch === null ? '' : dateMatch [1]
                return {
                    ...Object.fromEntries(rates.map(
                        rate => ([rate.period, { ir: rate.interestRate, delta: rate.delta, date }])
                    ))
                }
            })

        const nbp = await myFetch('https://nbp.pl/polityka-pieniezna/decyzje-rpp/podstawowe-stopy-procentowe-nbp/', { accept: 'text/html' })
            .then(resp => resp.toString('utf-8')).then(async html => {
                const document = new JSDOM(html).window.document
                return Object.fromEntries(
                    Array.from(document.querySelectorAll('table.nbptable tr'))
                        .map(tr => Array.from(tr.children))
                        .map(([name, value, date]) => [
                            getTextContent(name).trim(),
                            {
                                ir: getTextContent(value).trim().replace(',', '.'),
                                date: getTextContent(date).trim()
                            }
                        ]
                        ))
            })

        const timeWindow = new DateTime(-30, CacheAgeUnit.DAYS).getDateTime()
        const now = new DateTime().getDateTime()
        const conn = await db.getConnection()

        try {
            const irs: IRS = {}
            const data = { ...wibor, ...nbp }
            for (const name of Object.keys(INTEREST_RATES) as Array<keyof typeof INTEREST_RATES>) {
                await conn.query(
                    'insert into interest_rates (datetime, name, rate) values (?, ?, ?)',
                    [now, name, data[INTEREST_RATES[name]].ir]
                )

                irs [name] = {
                    history: await conn.query(
                        'select datetime, rate from interest_rates where name = ? and datetime >= ? order by datetime',
                        [name, timeWindow]
                    ),
                    current: data [INTEREST_RATES [name]].ir
                }
            }

            return irs

        } finally {
            await conn.end()
        }
    }
}

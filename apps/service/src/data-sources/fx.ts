import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { myFetch } from '../fetch'
import db from '../db'
import DateTime from '../DateTime'
import { parseHTML } from 'linkedom'
import { getTextContent } from './utils/get-text-context'
import { FXFeed, FXRateHistory, FXRates } from '@repo/types'

export const source: DataSourceDefinition<FXFeed> = {
  cron: '0 */3 * * *',
  id: 'fx',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 1,
  script: async () => {
    const [eur, usd, chf, gbp, uah, rub] = await Promise.all([
      myFetch('https://pl.investing.com/currencies/eur-pln', { accept: 'text/html' }).then(html => {
        return getTextContent(parseHTML(html).window.document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      myFetch('https://pl.investing.com/currencies/usd-pln', { accept: 'text/html' }).then(html => {
        return getTextContent(parseHTML(html).window.document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      myFetch('https://pl.investing.com/currencies/chf-pln', { accept: 'text/html' }).then(html => {
        return getTextContent(parseHTML(html).window.document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      myFetch('https://pl.investing.com/currencies/gbp-pln', { accept: 'text/html' }).then(html => {
        return getTextContent(parseHTML(html).window.document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      myFetch('https://pl.investing.com/currencies/pln-uah', { accept: 'text/html' }).then(html => {
        return getTextContent(parseHTML(html).window.document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      myFetch('https://pl.investing.com/currencies/pln-rub', { accept: 'text/html' }).then(html => {
        return getTextContent(parseHTML(html).window.document.body, '.text-2xl[data-test=instrument-price-last]')
      }),
    ])

    const rates: FXRates = {
      'EUR/USD': Number(Number(eur) / Number(usd)).toFixed(4),
      'EUR/UAH': Number(Number(eur) * Number(uah)).toFixed(4),
      'EUR/PLN': Number(eur).toFixed(4),
      'USD/PLN': Number(usd).toFixed(4),
      'CHF/PLN': Number(chf).toFixed(4),
      'GBP/PLN': Number(gbp).toFixed(4),
      'PLN/UAH': Number(uah).toFixed(4),
      'PLN/RUB': Number(rub).toFixed(4),
    }

    const timeWindow = new DateTime(-30, CacheAgeUnit.DAYS).getDateTime()
    const now = new DateTime().getDateTime()
    const conn = await db.getConnection()

    const history: FXRateHistory<FXRates> = {
      'EUR/USD': [],
      'EUR/UAH': [],
      'EUR/PLN': [],
      'USD/PLN': [],
      'CHF/PLN': [],
      'GBP/PLN': [],
      'PLN/UAH': [],
      'PLN/RUB': [],
    }

    try {
      for (const pair of Object.keys(rates)) {
        await conn.query('insert into fx (datetime, currency_pair, exchange_rate) values (?, ?, ?)', [
          now,
          pair,
          rates[pair as keyof FXRates],
        ])

        history[pair as keyof FXRates] = await conn.query(
          'select datetime, exchange_rate as value from fx where datetime >= ? and currency_pair = ? order by datetime',
          [timeWindow, pair],
        )
      }
    } finally {
      await conn.end()
    }

    return {
      history,
      rates,
    }
  },
}

import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { fetchDocument } from '@/fetch'
import { Inject } from '@/di'
import DateTime from '../DateTime'
import type { Pool } from 'mariadb'
import { getTextContent } from '@/utils/get-text-context'
import { FXFeed, FXRateHistory, FXRates } from '@repo/types'

export class FxSource extends DataSourceDefinition<FXFeed> {
  @Inject('db')
  declare private db: Pool
  getId() {
    return 'fx'
  }

  getCron() {
    return '0 */3 * * *'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR
  }

  async getData() {
    const [eur, usd, chf, gbp, uah, rub] = await Promise.all([
      fetchDocument('https://pl.investing.com/currencies/eur-pln', { accept: 'text/html' }).then(document => {
        return getTextContent(document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      fetchDocument('https://pl.investing.com/currencies/usd-pln', { accept: 'text/html' }).then(document => {
        return getTextContent(document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      fetchDocument('https://pl.investing.com/currencies/chf-pln', { accept: 'text/html' }).then(document => {
        return getTextContent(document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      fetchDocument('https://pl.investing.com/currencies/gbp-pln', { accept: 'text/html' }).then(document => {
        return getTextContent(document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      fetchDocument('https://pl.investing.com/currencies/pln-uah', { accept: 'text/html' }).then(document => {
        return getTextContent(document.body, '.text-2xl[data-test=instrument-price-last]')
      }),

      fetchDocument('https://pl.investing.com/currencies/pln-rub', { accept: 'text/html' }).then(document => {
        return getTextContent(document.body, '.text-2xl[data-test=instrument-price-last]')
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

    const timeWindow = DateTime.shift(-30, DateTime.DAY).getDateTime()
    const now = DateTime.now().getDateTime()
    const conn = await this.db.getConnection()

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
      conn.release()
    }

    return {
      history,
      rates,
    }
  }
}

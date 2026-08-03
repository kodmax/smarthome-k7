import { CacheAgeUnit, DataSource } from '@repo/feeds'
import { fetchDocument } from '@/fetch'
import { observeHttpFetch } from '@/prometheus/httpMetrics'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { Inject } from '@/di'
import DateTime from '../DateTime'
import type { Pool } from 'mariadb'
import { getTextContent } from '@/utils/get-text-context'
import { FXFeed, FXRateHistory, FXRates } from '@repo/types'

const fetchInvestingRate = async (url: string) => {
  const document = await observeHttpFetch(url, 'html', () => fetchDocument(url, { accept: 'text/html' }))
  return getTextContent(document.body, '.text-2xl[data-test=instrument-price-last]')
}

export class FxSource extends DataSource<FXFeed> {
  @Inject('db')
  declare private db: Pool

  static getId() {
    return 'fx'
  }

  static getCron() {
    return '0 */3 * * *'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR
  }

  protected getSourceMetricType() {
    return 'scraper' as const
  }

  protected async fetchData() {
    const [eur, usd, chf, gbp, uah, rub] = await Promise.all([
      fetchInvestingRate('https://pl.investing.com/currencies/eur-pln'),
      fetchInvestingRate('https://pl.investing.com/currencies/usd-pln'),
      fetchInvestingRate('https://pl.investing.com/currencies/chf-pln'),
      fetchInvestingRate('https://pl.investing.com/currencies/gbp-pln'),
      fetchInvestingRate('https://pl.investing.com/currencies/pln-uah'),
      fetchInvestingRate('https://pl.investing.com/currencies/pln-rub'),
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
        await observeDbQuery('insert', 'fx', () =>
          conn.query('insert into fx (datetime, currency_pair, exchange_rate) values (?, ?, ?)', [
            now,
            pair,
            rates[pair as keyof FXRates],
          ]),
        )

        history[pair as keyof FXRates] = await observeDbQuery('select', 'fx', () =>
          conn.query(
            'select datetime, exchange_rate as value from fx where datetime >= ? and currency_pair = ? order by datetime',
            [timeWindow, pair],
          ),
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

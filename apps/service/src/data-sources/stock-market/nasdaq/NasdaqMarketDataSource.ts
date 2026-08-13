import { DataSource, CacheAgeUnit } from '@repo/feeds'
import type { Sql } from '@repo/db'
import { Inject } from '@/di'
import { loadStockMarketTickers } from '../stockMarketTickers'
import { NasdaqMarketData } from './types'
import { getMarketInfo, getTickerData } from './src'

export class NasdaqMarketDataSource extends DataSource<NasdaqMarketData> {
  @Inject('db')
  declare private db: Sql
  static getId() {
    return 'nasdaq-stock-market'
  }

  static getCron() {
    return '*/5 9-3 * * Mon-Fri'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  protected getSourceMetricType() {
    return 'api' as const
  }

  protected async fetchData() {
    const tickers = await loadStockMarketTickers(this.db)
    const [marketInfo, tickerData] = await Promise.all([getMarketInfo(), Promise.all(tickers.map(getTickerData))])

    return { marketInfo, tickers: tickerData }
  }
}

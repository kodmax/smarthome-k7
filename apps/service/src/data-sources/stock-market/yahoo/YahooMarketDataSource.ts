import { DataSource, CacheAgeUnit } from '@repo/feeds'
import type { Sql } from '@repo/db'
import { Inject } from '@/di'
import { loadStockMarketTickers } from '../stockMarketTickers'
import { getTickerData, sleep } from './src'
import { YahooTickerData } from './types'

export class YahooMarketDataSource extends DataSource<YahooTickerData[]> {
  @Inject('db')
  declare private db: Sql
  static getId() {
    return 'yahoo-stock-market'
  }

  static getCron() {
    return '5 10 * * Mon-Fri'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  protected getSourceMetricType() {
    return 'api' as const
  }

  protected async fetchData() {
    const tickers = await loadStockMarketTickers(this.db)
    const yahooTickerData: YahooTickerData[] = []
    for (const ticker of tickers) {
      yahooTickerData.push(await getTickerData(ticker))
      await sleep(1000)
    }

    return yahooTickerData
  }
}

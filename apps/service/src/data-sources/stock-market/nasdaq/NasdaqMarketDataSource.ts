import { DataSource, CacheAgeUnit } from '@repo/feeds'
import { tickerList } from '../tickerList'
import { NasdaqMarketData } from './types'
import { getMarketInfo, getTickerData } from './src'

export class NasdaqMarketDataSource extends DataSource<NasdaqMarketData> {
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
    const [marketInfo, tickers] = await Promise.all([getMarketInfo(), Promise.all(tickerList.map(getTickerData))])

    return { marketInfo, tickers }
  }
}

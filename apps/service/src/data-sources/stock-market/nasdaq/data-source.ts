import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import { observeScraperRefresh } from '@/prometheus/scraperMetrics'
import { tickerList } from '../tickerList'
import { NasdaqMarketData } from './types'
import { getMarketInfo, getTickerData } from './src'

export class NasdaqMarketDataSource extends DataSourceDefinition<NasdaqMarketData> {
  getId() {
    return 'nasdaq-stock-market'
  }

  getCron() {
    return '*/5 9-3 * * Mon-Fri'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  async getData() {
    return observeScraperRefresh(this.getId(), async () => {
      const [marketInfo, tickers] = await Promise.all([getMarketInfo(), Promise.all(tickerList.map(getTickerData))])

      return { marketInfo, tickers }
    })
  }
}

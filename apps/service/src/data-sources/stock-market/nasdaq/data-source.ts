import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
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

  isSnapshotExpired(snapshot: { age: (unit: CacheAgeUnit) => number }) {
    return snapshot.age(CacheAgeUnit.HOURS) > 24
  }

  async getData() {
    const [marketInfo, tickers] = await Promise.all([getMarketInfo(), Promise.all(tickerList.map(getTickerData))])

    return { marketInfo, tickers }
  }
}

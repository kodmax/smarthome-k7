import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import { tickerList } from '../tickerList'
import { NasdaqMarketData } from './types'
import { getMarketInfo, getTickerData } from './src'

export const source: DataSourceDefinition<NasdaqMarketData> = {
  cron: '*/5 9-3 * * Mon-Fri',
  id: 'nasdaq-stock-market',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 24,
  script: async () => {
    const [marketInfo, tickers] = await Promise.all([getMarketInfo(), Promise.all(tickerList.map(getTickerData))])

    return { marketInfo, tickers }
  },
}

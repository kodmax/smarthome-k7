import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import { StockMarketFeed } from '@repo/types'
import { getTickersData } from './nasdaq'
import { tickerList } from './tickerList'

export const source: DataSourceDefinition<StockMarketFeed> = {
  cron: '1-59/5 10-2 * * Mon-Fri',
  id: 'stock-market',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 24,
  script: async () => {
    return {
      tickers: await getTickersData(tickerList),
    }
  },
}

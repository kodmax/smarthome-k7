import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import { StockMarketData, TickerData } from '@repo/types'
import { getTickerData } from './getTickerData'
import { tickerList } from './tickerList'
import { sleep } from './sleep'

export const source: DataSourceDefinition<StockMarketData> = {
  cron: '1,31 10-2 * * Mon-Fri',
  id: 'stock-market',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 24,
  script: async () => {
    const tickers: TickerData[] = []
    for (const ticker of tickerList) {
      tickers.push(await getTickerData(ticker))
      await sleep(1000)
    }

    return {
      tickers,
    }
  },
}

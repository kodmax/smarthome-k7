import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import { tickerList } from '../tickerList'
import { NasdaqTickerData } from './types'
import { getTickerData } from './src'

export const source: DataSourceDefinition<NasdaqTickerData[]> = {
  cron: '*/5 10-2 * * Mon-Fri',
  id: 'nasdaq-stock-market',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 24,
  script: async () => {
    const tickers: NasdaqTickerData[] = []
    for (const ticker of tickerList) {
      tickers.push(await getTickerData(ticker))
    }

    return tickers
  },
}

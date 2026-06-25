import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import { tickerList } from '../tickerList'
import { NasdaqEPSData } from './types'
import { getTickerData } from './src'

export const source: DataSourceDefinition<NasdaqEPSData[]> = {
  cron: '5 10 * * Mon-Fri',
  id: 'nasdaq-eps',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 24,
  script: async () => {
    const tickers: NasdaqEPSData[] = []
    for (const ticker of tickerList) {
      tickers.push(await getTickerData(ticker))
    }

    return tickers
  },
}

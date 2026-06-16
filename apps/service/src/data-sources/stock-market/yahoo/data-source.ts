import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import { getTickerData, sleep } from './src'
import { tickerList } from '../tickerList'
import { YahooTickerData } from './types'

export const source: DataSourceDefinition<YahooTickerData[]> = {
  cron: '5 10 * * Mon-Fri',
  id: 'yahoo-stock-market',

  expired: snapshot => snapshot.age(CacheAgeUnit.HOURS) > 24,
  script: async () => {
    const yahooTickerData: YahooTickerData[] = []
    for (const ticker of tickerList) {
      yahooTickerData.push(await getTickerData(ticker))
      await sleep(1000)
    }

    return yahooTickerData
  },
}

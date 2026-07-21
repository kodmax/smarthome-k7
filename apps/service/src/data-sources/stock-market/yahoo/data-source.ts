import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import { getTickerData, sleep } from './src'
import { tickerList } from '../tickerList'
import { YahooTickerData } from './types'

export class YahooMarketDataSource extends DataSourceDefinition<YahooTickerData[]> {
  getId() {
    return 'yahoo-stock-market'
  }

  getCron() {
    return '5 10 * * Mon-Fri'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  async getData() {
    const yahooTickerData: YahooTickerData[] = []
    for (const ticker of tickerList) {
      yahooTickerData.push(await getTickerData(ticker))
      await sleep(1000)
    }

    return yahooTickerData
  }
}

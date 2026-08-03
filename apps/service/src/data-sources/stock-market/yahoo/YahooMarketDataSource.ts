import { DataSource, CacheAgeUnit } from '@repo/feeds'
import { getTickerData, sleep } from './src'
import { tickerList } from '../tickerList'
import { YahooTickerData } from './types'

export class YahooMarketDataSource extends DataSource<YahooTickerData[]> {
  static getId() {
    return 'yahoo-stock-market'
  }

  static getCron() {
    return '5 10 * * Mon-Fri'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  protected getSourceMetricType() {
    return 'api' as const
  }

  protected async fetchData() {
    const yahooTickerData: YahooTickerData[] = []
    for (const ticker of tickerList) {
      yahooTickerData.push(await getTickerData(ticker))
      await sleep(1000)
    }

    return yahooTickerData
  }
}

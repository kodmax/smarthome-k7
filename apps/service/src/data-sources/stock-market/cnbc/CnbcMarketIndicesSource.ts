import { DataSource, CacheAgeUnit } from '@repo/feeds'
import { getMarketIndexQuotes } from './getMarketIndexQuotes'
import { CnbcMarketIndicesData } from './types'

export class CnbcMarketIndicesSource extends DataSource<CnbcMarketIndicesData> {
  static getId() {
    return 'cnbc-market-indices'
  }

  static getCron() {
    return '*/5 9-3 * * Mon-Fri'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  protected getSourceMetricType() {
    return 'scraper' as const
  }

  protected async fetchData() {
    return getMarketIndexQuotes()
  }
}

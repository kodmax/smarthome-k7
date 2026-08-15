import { DataSource, CacheAgeUnit } from '@repo/feeds'
import { MarketIndices } from '@repo/types'
import { getMarketIndexQuotes } from './getMarketIndexQuotes'

export class MarketIndicesSource extends DataSource<MarketIndices> {
  static getId() {
    return 'market-indices'
  }

  static getCron() {
    return '*/5 9-3 * * Mon-Fri'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  protected getSourceMetricType() {
    return 'api' as const
  }

  protected async fetchData() {
    return getMarketIndexQuotes()
  }
}

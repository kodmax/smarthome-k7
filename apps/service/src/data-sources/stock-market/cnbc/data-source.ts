import { DataSourceDefinition, CacheAgeUnit } from '@repo/feeds'
import { getMarketIndexQuotes } from './getMarketIndexQuotes'
import { CnbcMarketIndicesData } from './types'

export class CnbcMarketIndicesSource extends DataSourceDefinition<CnbcMarketIndicesData> {
  getId() {
    return 'cnbc-market-indices'
  }

  getCron() {
    return '*/5 9-3 * * Mon-Fri'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  getSourceMetricType() {
    return 'scraper' as const
  }

  async getData() {
    return getMarketIndexQuotes()
  }
}

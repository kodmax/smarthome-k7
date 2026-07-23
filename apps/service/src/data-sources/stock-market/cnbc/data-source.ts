import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
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

  async getData() {
    return getMarketIndexQuotes()
  }
}

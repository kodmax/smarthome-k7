import { DataSourceDefinition, CacheAgeUnit } from '@repo/apollo-ws'
import { observeScraperRefresh } from '@/prometheus/scraperMetrics'
import { getForexRates } from './getForexRates'
import { CnbcForexData } from './types'

export class CnbcForexSource extends DataSourceDefinition<CnbcForexData> {
  getId() {
    return 'cnbc-forex'
  }

  getCron() {
    return '*/5 * * * *'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  async getData() {
    return observeScraperRefresh(this.getId(), () => getForexRates())
  }
}

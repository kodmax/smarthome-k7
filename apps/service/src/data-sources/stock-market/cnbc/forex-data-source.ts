import { DataSourceDefinition, CacheAgeUnit } from '@repo/feeds'
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

  getSourceMetricType() {
    return 'scraper' as const
  }

  async getData() {
    return getForexRates()
  }
}

import { DataSource, CacheAgeUnit } from '@repo/feeds'
import { getForexRates } from './getForexRates'
import { CnbcForexData } from './types'

export class CnbcForexSource extends DataSource<CnbcForexData> {
  static getId() {
    return 'cnbc-forex'
  }

  static getCron() {
    return '*/5 * * * *'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  protected getSourceMetricType() {
    return 'scraper' as const
  }

  protected async fetchData() {
    return getForexRates()
  }
}

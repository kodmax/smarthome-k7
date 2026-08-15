import { DataSource, CacheAgeUnit } from '@repo/feeds'
import { ForexRates } from '@repo/types'
import { getForexRates } from './getForexRates'

export class ForexSource extends DataSource<ForexRates> {
  static getId() {
    return 'forex'
  }

  static getCron() {
    return '*/5 * * * *'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 24
  }

  protected getSourceMetricType() {
    return 'api' as const
  }

  protected async fetchData() {
    return getForexRates()
  }
}

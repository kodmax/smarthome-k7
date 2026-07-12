import { MarketStatus } from '@repo/types'
import { type Translations } from '@/i18n/translations/types'

export const getMarketStatusTitle = (
  status: MarketStatus,
  labels: Translations['dashboard']['stockMarket']['status'],
) => {
  switch (status) {
    case 'After-Hours':
      return labels.afterHours
    case 'Pre-Market':
      return labels.preMarket
    case 'Closed':
      return labels.closed
    case 'Open':
      return labels.open
  }
}

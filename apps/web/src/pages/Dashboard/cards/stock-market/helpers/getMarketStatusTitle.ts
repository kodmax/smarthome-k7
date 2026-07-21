import { MarketStatus } from '@repo/types'

type MarketStatusLabels = {
  afterHours: string
  preMarket: string
  closed: string
  open: string
}

export const getMarketStatusTitle = (status: MarketStatus, labels: MarketStatusLabels) => {
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

export const QUOTES_OVERVIEW_VIEW_ORDER = [
  'high-upside',
  'low-forward-pe',
  'earnings-soon',
  'price-target-change',
] as const

export type QuotesOverviewView = (typeof QUOTES_OVERVIEW_VIEW_ORDER)[number]

export const DEFAULT_QUOTES_OVERVIEW_VIEW: QuotesOverviewView = 'high-upside'

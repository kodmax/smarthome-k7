export const STOCK_QUOTES_FILTER_ORDER = ['high-upside', 'low-forward-pe', 'earnings-soon'] as const

export type StockQuotesFilter = (typeof STOCK_QUOTES_FILTER_ORDER)[number]

export const DEFAULT_STOCK_QUOTES_FILTER: StockQuotesFilter = 'high-upside'

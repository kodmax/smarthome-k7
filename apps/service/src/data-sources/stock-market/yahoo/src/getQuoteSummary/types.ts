export type Rating = {
  action: 'reit' | 'main'
  currentPriceTarget: number
  epochGradeDate: number
  firm: string
  fromGrade: 'Buy' | 'Sell' | 'Hold' | 'Overweight' | 'Market Outperform' | 'Outperform' | 'Sector Outperform'
  priceTargetAction: 'Maintains' | 'Raises' | 'Announces' | 'Lowers'
  priorPriceTarget: number
  toGrade: 'Buy' | 'Sell' | 'Hold' | 'Overweight' | 'Market Outperform' | 'Outperform' | 'Sector Outperform'
}

export type RatingPeriod = '7d' | '30d' | '90d'

export type YahooQuoteSummary = {
  upgradeDowngradeHistory?: {
    history: Rating[]
  }
}

export interface QuoteSummaryResponse {
  quoteSummary: {
    result: YahooQuoteSummary[]
    error: null
  }
}

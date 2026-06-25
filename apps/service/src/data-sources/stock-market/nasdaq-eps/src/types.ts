export type NasdaqApiResponse<T> = {
  data: T
  message: string | null
  status: {
    rCode: number
    bCodeMessage: string | null
    developerMessage: string | null
  }
}

export interface EarningsResponseRow {
  fiscalQtrEnd: string
  dateReported: string
  eps: number
  consensusForecast: string
  percentageSurprise: string
}

export interface EarningsResponse {
  symbol: string
  chart: unknown[]
  earningsSurpriseTable: {
    headers: {
      fiscalQtrEnd: 'Fiscal Quarter End'
      dateReported: 'Date Reported'
      eps: 'Earnings Per Share*'
      consensusForecast: 'Consensus EPS* Forecast'
      percentageSurprise: '% Surprise'
    }
    rows: EarningsResponseRow[]
  }
}

export interface EarningsForecastResponseRow {
  fiscalEnd: string
  consensusEPSForecast: number
  highEPSForecast: number
  lowEPSForecast: number
  noOfEstimates: number
  up: number
}

export interface EarningsForecastResponse {
  symbol: string
  quarterlyForecast: {
    asOf: null
    headers: {
      fiscalEnd: 'Fiscal Quarter End'
      consensusEPSForecast: 'Consensus EPS* Forecast'
      highEPSForecast: 'High EPS* Forecast'
      lowEPSForecast: 'Low EPS* Forecast'
      noOfEstimates: 'Number of Estimates'
      up: 'Over the Last 4 Weeks Number of Revisions - Up'
      down: 'Over the Last 4 Weeks Number of Revisions - Down'
    }
    rows: EarningsForecastResponseRow[]
  } | null
  yearlyForecast: {
    asOf: null
    headers: {
      fiscalEnd: 'Fiscal Year End'
      consensusEPSForecast: 'Consensus EPS* Forecast'
      highEPSForecast: 'High EPS* Forecast'
      lowEPSForecast: 'Low EPS* Forecast'
      noOfEstimates: 'Number of Estimates'
      up: 'Over the Last 4 Weeks Number of Revisions - Up'
      down: 'Over the Last 4 Weeks Number of Revisions - Down'
    }
    rows: EarningsForecastResponseRow[]
  } | null
}

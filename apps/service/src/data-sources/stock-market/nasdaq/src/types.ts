import { MarketStatus } from '@repo/types'

export type NasdaqApiResponse<T> = {
  data: T
  message: string | null
  status: {
    rCode: number
    bCodeMessage: string | null
    developerMessage: string | null
  }
}

export type NasdaqApiQuoteInfo = {
  symbol: string
  companyName: string
  stockType: 'Common Stock'
  exchange: 'NASDAQ-GS' | 'NYSE'
  isNasdaqListed: boolean
  isNasdaq100: boolean
  isHeld: boolean
  primaryData: {
    lastSalePrice: '$209.70'
    netChange: '+4.51'
    percentageChange: '+2.20%'
    deltaIndicator: 'up'
    lastTradeTimestamp: 'Jun 15, 2026 10:48 AM ET'
    isRealTime: boolean
    bidPrice: '$209.70'
    askPrice: '$209.72'
    bidSize: '20'
    askSize: '46'
    volume: '40,944,979.092621'
    currency: null
  }
  secondaryData: null | {
    lastSalePrice: '$212.45'
    netChange: '+7.26'
    percentageChange: '+3.54%'
    deltaIndicator: 'up'
    lastTradeTimestamp: 'Closed at Jun 15, 2026 4:00 PM ET'
    isRealTime: false
    bidPrice: ''
    askPrice: ''
    bidSize: ''
    askSize: ''
    volume: ''
    currency: null
  }
  marketStatus: MarketStatus
  assetClass: 'STOCKS'
  keyStats: {
    fiftyTwoWeekHighLow: {
      label: '52 Week Range:'
      value: '140.85 - 236.54'
    }
    dayrange: {
      label: 'High/Low:'
      value: '208.34 - 210.99'
    }
  }
  notifications: []
}

export type NasdaqApiMarketInfo = {
  country: 'U.S.'
  marketIndicator: 'Market Closed'
  uiMarketIndicator: 'Market Closed'
  marketCountDown: 'Market Opens in 6H 12M'
  preMarketOpeningTime: 'Jul 7, 2026 04:00 AM ET'
  preMarketClosingTime: 'Jul 7, 2026 09:30 AM ET'
  marketOpeningTime: 'Jul 7, 2026 09:30 AM ET'
  marketClosingTime: 'Jul 7, 2026 04:00 PM ET'
  afterHoursMarketOpeningTime: 'Jul 7, 2026 04:00 PM ET'
  afterHoursMarketClosingTime: 'Jul 7, 2026 08:00 PM ET'
  previousTradeDate: 'Jul 6, 2026'
  nextTradeDate: 'Jul 8, 2026'
  isBusinessDay: boolean
  mrktStatus: MarketStatus
  mrktCountDown: 'Opens in 6H 12M'
  pmOpenRaw: '2026-07-07T04:00:00'
  ahCloseRaw: '2026-07-07T20:00:00'
  openRaw: '2026-07-07T09:30:00'
  closeRaw: '2026-07-07T16:00:00'
}

export type NasdaqApiQuoteSummary = {
  symbol: 'MSFT'
  summaryData: {
    Exchange: {
      label: 'Exchange'
      value: 'NASDAQ-GS'
    }
    Sector: {
      label: 'Sector'
      value: 'Technology'
    }
    Industry: {
      label: 'Industry'
      value: 'Computer Software: Prepackaged Software'
    }
    OneYrTarget: {
      label: '1 Year Target'
      value: '$550.00'
    }
    TodayHighLow: {
      label: "Today's High/Low"
      value: '$399.6/$392.845'
    }
    ShareVolume: {
      label: 'Share Volume'
      value: '6,331,088.271005'
    }
    AverageVolume: {
      label: 'Average Volume'
      value: '34,822,381'
    }
    PreviousClose: {
      label: 'Previous Close'
      value: '$390.74'
    }
    FiftTwoWeekHighLow: {
      label: '52 Week High/Low'
      value: '$555.45/$356.28'
    }
    MarketCap: {
      label: 'Market Cap'
      value: '2,966,396,830,348'
    }
    AnnualizedDividend: {
      label: 'Annualized Dividend'
      value: '$3.64'
    }
    ExDividendDate: {
      label: 'Ex Dividend Date'
      value: 'May 21, 2026'
    }
    DividendPaymentDate: {
      label: 'Dividend Pay Date'
      value: 'Jun 11, 2026'
    }
    Yield: {
      label: 'Current Yield'
      value: '0.93%'
    }
  }
  assetClass: 'STOCKS'
  additionalData: null
  bidAsk: {
    'Bid * Size': {
      label: 'Bid * Size'
      value: '$399.34 * 4'
    }
    'Ask * Size': {
      label: 'Ask * Size'
      value: '$399.42 * 42'
    }
  }
}

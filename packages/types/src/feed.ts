import { type KnxReading } from 'js-knx'

export { KnxReading as KnxReadingType }

export type EnergyRates = {
  added: number
  distribution: string
  energy: string
  vat: number
}

export type EnergyHourConsumption = {
  hourly_consumption: number
  hour: string
}

export type StockMarketStatus = 'Open' | 'After-Hours' | 'Closed' | 'Pre-Market'

export type TickerData = {
  ticker: string
  title: string
  marketCap: number
  exchange: {
    name: 'NASDAQ-GS' | 'NYSE'
    status: StockMarketStatus
  }
  price: {
    lastTradeTimestamp: string
    lastTradePrice: number
    netChange: number
    percentageChange: number
    oneYearTarget: number
  }
  statistics: {
    trailingEPS: number
    forwardEPS: number | null
  }
  earningsDate: {
    confirmed?: string
    estimated?: string
  }
}

export type StockMarketFeed = {
  tickers: TickerData[]
}

export type Co2HistoryRecord = {
  datetime: string
  value: number
}

export type EnergyFeed = {
  total: {
    adjusted: number
    target: string
    source: string
    text: string
    unit: string
    value: number
  }
  today: {
    value: number
    bars: EnergyHourConsumption[]
  }
  cost: {
    datetime: string
    rates: EnergyRates
    avg: number
  }
  instant: KnxReading<number>
  meter: KnxReading<number>
}

export type Torrent = {
  added: string
  category: string
  id: string
  imdb: string
  info_hash: string
  leechers: string
  name: string
  num_files: string
  seeders: string
  size: string
  status: string
  username: string
}

export type DayWeatherForecast = {
  temp: { high: number; low: number }
  date: string
  dow: string
  icon: string
}

export type HourWeatherForecast = {
  precipIcon: string
  precip: string
  temp: string
  icon: string
  hour: string
  sun: {
    altitude: number
    azimuth: number
  }
}

export type WeatherFeed = {
  outdoorTemp: Array<{ hour: number; value: string }>
  instant: {
    clouds: {
      coverage: string
      height: string
    }
    wind: {
      angle: number
      maxSpeed: number
      speedUnit: string
      direction: string
      speed: number
    }
    humidity: number
    pressure: number
    temp: number
    uv: number
  }
  sunTimes: {
    sunrise: string
    sunset: string
    dusk: string
    dawn: string
  }
  pressure: {
    week: {
      datetime: string
      pressure: number
    }[]
    instant: number
  }
  allergens: {
    id: string | null
    name: string
    intensity: string
  }[]
  forecast: DayWeatherForecast[]
  hourly: HourWeatherForecast[]
  aq: {
    aqi: number
    pollutants: {
      [k: string]: {
        concentration: string
        index: string
      }
    }
  }
}

export type PriceHistory = {
  datetime: string
  price: string
}

export type CommoditiesFeed = {
  oil: {
    'PLN/l': number
    history: PriceHistory[]
  }
  ng: {
    'PLN/GJ': number
    history: PriceHistory[]
  }
  coal: {
    'PLN/MT': number
    history: PriceHistory[]
  }
  gold: {
    'PLN/g': number
    history: PriceHistory[]
  }
  btc: {
    'BTC/USD': number
    history: PriceHistory[]
  }
  inflation: {
    history: Array<{
      datetime: string
      value: number
    }>
  }
}

export type Co2Data = {
  date: string
  today: Co2HistoryRecord[]
  target: string
  source: string
  text: string
  unit: string
  value: number
  alert: KnxReading<number>
}

export type TemperatureData = {
  status: {
    lazienka: KnxReading<number>
    lazienkaPodloga: KnxReading<number>
    sypialnia: KnxReading<number>
    salon: KnxReading<number>
  }
  mode: {
    livingroom: KnxReading<number>
    bathroom: KnxReading<number>
    bedroom: KnxReading<number>
  }
}

export type SalaryUnit = 'Year' | 'Month' | 'Day' | 'Hour'
export type ContractType = 'permanent' | 'b2b'

export type WorkplaceType = 'office' | 'remote' | 'hybrid'
export type EmploymentType = 'permanent' | 'b2b'
export type SalaryRange = {
  from: number
  to: number
}

export type JobAd = {
  id: string
  title: string
  advertUrl: string
  companyLogoUrl: string
  companyName: string
  requiredSkills: string[]
  workplaceType: WorkplaceType
  employmentType: EmploymentType
  monthlySalaryRangeAfterTaxes?: SalaryRange
  isUnwantedCompany: boolean
  origin: 'jj' | 'nfj' | 'theprotocol'
}

export type JobsFeed = {
  ads: JobAd[]
}

export type Article = {
  title: string
  href: string
}

export type NewsFeed = {
  articles: Article[]
}

export type AllergenData = {
  intensity: string
  name: string
  id: string
}

export type AllergensFeed = {
  allergens: AllergenData[]
}

export type FuelPrice = {
  current: number
  history: Array<{
    datetime: string
    price: string
  }>
}

export type FuelPricesFeed = {
  [k: string]: FuelPrice
}

export type FXRates = {
  'EUR/USD': string
  'EUR/PLN': string
  'USD/PLN': string
  'CHF/PLN': string
  'GBP/PLN': string
  'PLN/UAH': string
  'PLN/RUB': string
  'EUR/UAH': string
}

export type FXRate = {
  datetime: string
  exchange_rate: string
}

export type FXRateHistory<T extends Record<string, string>> = {
  [K in keyof T]: Array<FXRate>
}

export type FXFeed = {
  history: FXRateHistory<FXRates>
  rates: FXRates
}

export enum INTEREST_RATES {
  'NBP Ref.' = 'Stopa referencyjna 1)',
  'WIBOR 1M' = 'WIBOR 1M',
  'WIBOR 3M' = 'WIBOR 3M',
  'WIBOR 6M' = 'WIBOR 6M',
}

export type InterestRatesKeys = keyof typeof INTEREST_RATES
export type InterestRateData = {
  current: string
  history: Array<{
    datetime: string
    rate: string
  }>
}

export type InterestRatesFeed = {
  readonly [K in InterestRatesKeys]: InterestRateData
}

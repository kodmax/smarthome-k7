import { type KnxReading } from 'js-knx'

export { KnxReading as KnxReadingType }

export type EnergyRates = {
  added: number
  distribution: number
  energy: number
  vat: number
}

export type EnergyHourConsumption = {
  hourly_consumption: number
  hour: number
}

export type MarketStatus = 'Open' | 'After-Hours' | 'Closed' | 'Pre-Market'

export type QuoteSummary = {
  ratingsCount: {
    last90days: number
    last30days: number
    last7days: number
  }
  priceTarget: {
    last90days: number | null
    last30days: number | null
    last7days: number | null
  }
  priceTargetChange: {
    last90days: number | null
    last30days: number | null
    last7days: number | null
  }
}

export type TickerData = {
  symbol: string
  title: string
  marketCap: number
  exchange: 'NASDAQ-GS' | 'NYSE'
  price: {
    lastTradeTimestamp: string
    lastTradePrice: number
    netChange: number
    percentageChange: number
    oneYearTarget: number | null
    priceTarget: number | null
    eg: number | null
  }
  statistics: {
    trailingEPS: number
    forwardEPS: number | null
  }
  earningsDate: {
    confirmed?: string
    estimated?: string
  }
  quoteSummary: QuoteSummary
}

export type MarketInfo = {
  country: string
  status: MarketStatus
  indicator: string
  uiIndicator: string
  countdown: string
  marketCountdown: string
  isBusinessDay: boolean
  previousTradeDate: number
  nextTradeDate: number
  preMarketOpeningTime: number
  preMarketClosingTime: number
  marketOpeningTime: number
  marketClosingTime: number
  afterHoursMarketOpeningTime: number
  afterHoursMarketClosingTime: number
}

export type StockMarketFeed = {
  marketInfo: MarketInfo
  tickers: TickerData[]
}

export type Co2HistoryRecord = {
  hour: number
  value: number
}

export type KNXReadingPayload<T = number> = {
  reading: KnxReading<T>
  history?: Record<string, unknown>
}

export type EnergyFeed = {
  daily: KNXReadingPayload & {
    history: { today: EnergyHourConsumption[] }
  }
  instant: KNXReadingPayload
  meter: KNXReadingPayload
  total: KNXReadingPayload & {
    adjusted: number
  }
  cost: {
    datetime: string
    rates: EnergyRates
    avg: number
  }
}

export type Torrent = {
  added: string
  category: string
  id: string
  imdb: string | null
  info_hash: string
  leechers: string
  name: string
  num_files: string
  seeders: string
  size: string
  status: string
  username: string
}

export type TransmissionSessionStats = {
  downloadSpeed: number
  torrentCount: number
  uploadSpeed: number
}

export type TransmissionFeed = {
  sessionStats: TransmissionSessionStats
}

export type DayWeatherForecast = {
  temp: { high: number; low: number }
  date: string
  dow: string
  icon: string
}

export type PrecipType = 'none' | 'rain' | 'snow' | 'hail' | 'sleet' | 'ice' | 'mixed'

export type HourWeatherForecast = {
  precipType: PrecipType
  precip: string
  temp: string
  icon: string
  hour: string
  date: string
  wind: {
    direction: string | null
    speed: number
  }
  sun: {
    altitude: number
    azimuth: number
  }
  uv: number
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

export type AirQualityHistory = {
  date: string
  today: Co2HistoryRecord[]
}

export type Co2Data = {
  reading: KnxReading<number>
  history: AirQualityHistory
  alert: KnxReading<number>
}

export type HumidityData = {
  reading: KnxReading<number>
  history: AirQualityHistory
}

export type HomeTempFeedData = {
  reading: KnxReading<number>
  history: AirQualityHistory
  setpoint?: string
}

export type LightCircuitFeedEntry = {
  reading: KnxReading<number>
}

export type LightsFeed = {
  circuits: Record<string, LightCircuitFeedEntry>
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
  origin: 'jj' | 'nfj' | 'theprotocol'
  applied: boolean
  hide: boolean
  fav: boolean
}

export type JobsFeed = {
  ads: JobAd[]
}

export type Article = {
  title: string
  href: string
  uid: string
  read: boolean
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

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

export type { JobApplyStatus } from './jobApplyStatusFlow'
export { DEFAULT_JOB_APPLY_STATUS } from './jobApplyStatusFlow'
import type { JobApplyStatus } from './jobApplyStatusFlow'
import { DEFAULT_JOB_APPLY_STATUS } from './jobApplyStatusFlow'

export type JobAdApplicationMeta = {
  applyStatus: JobApplyStatus
  comment: string | null
  appliedAt: string | null
}

export type JobAdApplication = {
  status: JobApplyStatus
  comment: string | null
  appliedAt: string | null
  statusChangedAt: string | null
}

export type JobAdMeta = {
  application: JobAdApplication
  fav: boolean
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
  publishedAt: string
}

export type JobAdWithMeta = JobAd & {
  meta: JobAdMeta
}

export type JobsFeed = {
  ads: JobAdWithMeta[]
}

export type JobsCachedFeed = {
  ads: JobAd[]
}

export type JobMarketInsightFeed = {
  adsCount: number
  newOffersCount: number
  medianSalary: number | null
  offersWithSalaryRangePercent: number
  remoteWorkPercent: number
  permanentEmploymentPercent: number
}

export type JobMarketInsightCachedFeed = {
  ads: JobAd[]
}

export function emptyJobAdApplication(): JobAdApplication {
  return {
    status: DEFAULT_JOB_APPLY_STATUS,
    comment: null,
    appliedAt: null,
    statusChangedAt: null,
  }
}

export function emptyJobAdMeta(): JobAdMeta {
  return {
    application: emptyJobAdApplication(),
    fav: false,
  }
}

export function jobAdApplicationFromMeta(
  meta: JobAdApplicationMeta,
  statusChangedAt: string | null = null,
): JobAdApplication {
  return {
    status: meta.applyStatus,
    comment: meta.comment,
    appliedAt: meta.appliedAt,
    statusChangedAt,
  }
}

export function jobAdApplicationMetaFromApplication(application: JobAdApplication): JobAdApplicationMeta {
  return {
    applyStatus: application.status,
    comment: application.comment,
    appliedAt: application.appliedAt,
  }
}

export function isJobAdApplied(ad: Pick<JobAdWithMeta, 'meta'>): boolean {
  return ad.meta.application.appliedAt !== null
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

export type NewsCachedFeed = {
  articles: Omit<Article, 'read'>[]
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

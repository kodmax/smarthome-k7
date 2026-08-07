import { type KnxReading } from 'js-knx'
import { type SkillExperienceLevel } from './skillExperienceLevel'

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

export type MarketIndexQuote = {
  symbol: string
  title: string
  price: number
  netChange: number
  percentageChange: number
}

export type ForexQuote = MarketIndexQuote

export type MarketIndices = {
  sp500: MarketIndexQuote
  sp500Futures: MarketIndexQuote
}

export type ForexRates = {
  usdPln: ForexQuote
  eurPln: ForexQuote
}

export type FxRatesFeed = ForexRates

export type StockMarketFeed = {
  marketInfo: MarketInfo
  marketIndices: MarketIndices
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
    bathroom: KnxReading<number>
    bathroomFloor: KnxReading<number>
    bedroom: KnxReading<number>
    livingroom: KnxReading<number>
  }
  mode: {
    livingroom: KnxReading<number>
    bathroom: KnxReading<number>
    bedroom: KnxReading<number>
  }
}

export type SalaryUnit = 'Year' | 'Month' | 'Day' | 'Hour'
export type ContractType =
  | 'permanent'
  | 'b2b'
  | 'uod'
  | 'mandate_contract'
  | 'any'
  | 'contract'
  | 'internship'
  | 'intern'

export type WorkplaceType = 'office' | 'remote' | 'hybrid'
export type EmploymentType =
  | 'permanent'
  | 'b2b'
  | 'uod'
  | 'mandate_contract'
  | 'any'
  | 'contract'
  | 'internship'
  | 'intern'

export type SalaryRange = {
  from: number
  to: number
}

export type { JobApplyStatus, JobAdArchiveReason } from './jobApplyStatusFlow'
export { DEFAULT_JOB_APPLY_STATUS } from './jobApplyStatusFlow'
import type { JobAdArchiveReason, JobApplyStatus } from './jobApplyStatusFlow'
import { DEFAULT_JOB_APPLY_STATUS } from './jobApplyStatusFlow'

export type JobAdApplicationMeta = {
  applyStatus: JobApplyStatus
  archiveReason: JobAdArchiveReason | null
  comment: string | null
  appliedAt: string | null
  rejectedAt: string | null
  statusChangedAt: string | null
}

export type JobAdApplication = {
  status: JobApplyStatus
  archiveReason: JobAdArchiveReason | null
  comment: string | null
  appliedAt: string | null
  rejectedAt: string | null
  statusChangedAt: string | null
}

export type JobAdMatchAnalysis = {
  analyzedAt: string
  score: number
  summary: string
  strengths: string
  gaps: string
  observations: string
  conclusion: string
}

export type JobAdMeta = {
  application: JobAdApplication
  fav: boolean
  isCurrentCVUsed: boolean
  addedAt?: string | null
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
  takeHomeHourlyRate?: number
  paidVacationDays?: number
  origin: 'jj' | 'nfj' | 'theprotocol' | 'manual'
  publishedAt: string
}

export type JobAdsFeedItem = {
  content: JobAd
  meta: JobAdMeta
  matchAnalysis: JobAdMatchAnalysis | null
}

export type JobAdsSalaryRange = {
  min: number
  max: number
}

export type JobAdsHourlySalaryCalculation = {
  vacationDaysPerYear: number
  workingDaysPerYear: number
  workingDaysPerWeek: number
  timeSpentRemote: number
  timeSpentOffice: number
  hybridOfficeDaysPerWeek: number
}

export type JobAdsFeed = {
  ads: JobAdsFeedItem[]
  salaryRange: JobAdsSalaryRange | null
  acceptableSalary: number | null
}

export type JobAdStoredMeta = {
  application: JobAdApplicationMeta
  fav: boolean
  firstPublishedAt: string
}

export type JobAdDocument = {
  content: JobAd
  meta: JobAdStoredMeta
}

export type JobAdsCachedFeed = {
  listingIds: string[]
}

export function emptyJobAdStoredMeta(firstPublishedAt: string): JobAdStoredMeta {
  return {
    application: {
      applyStatus: DEFAULT_JOB_APPLY_STATUS,
      archiveReason: null,
      comment: null,
      appliedAt: null,
      rejectedAt: null,
      statusChangedAt: null,
    },
    fav: false,
    firstPublishedAt,
  }
}

export type JobMarketSalaryDistributionBracket = {
  id: 'below10k' | 'from10to15k' | 'from15to20k' | 'from20to25k' | 'from25to30k' | 'from30to35k' | 'above35k'
  percentage: number
}

export type JobMarketPopularTechnology = {
  id: string
  name: string
  offersCount: number
  sharePercent: number
  medianSalary: number | null
}

export type JobMarketInsightMetrics = {
  adsCount: number
  newOffersCount: number
  medianSalary: number
  p90Salary: number
  p90OffersCount: number
  offersWithSalaryRangePercent: number
  remoteWorkPercent: number
  hybridWorkPercent: number
  officeWorkPercent: number
  permanentEmploymentPercent: number
  popularTechnologies: JobMarketPopularTechnology[]
  salaryDistribution: JobMarketSalaryDistributionBracket[]
}

export type JobMarketChangeMetric = {
  value: number
  previous: number | null
}

export type JobMarketInsightFeed = {
  adsCount: JobMarketChangeMetric
  newOffersCount: JobMarketChangeMetric
  medianSalary: JobMarketChangeMetric
  p90Salary: JobMarketChangeMetric
  p90OffersCount: JobMarketChangeMetric
  offersWithSalaryRangePercent: JobMarketChangeMetric
  remoteWorkPercent: JobMarketChangeMetric
  hybridWorkPercent: JobMarketChangeMetric
  officeWorkPercent: JobMarketChangeMetric
  permanentEmploymentPercent: JobMarketChangeMetric
  popularTechnologies: JobMarketPopularTechnology[]
  salaryDistribution: JobMarketSalaryDistributionBracket[]
}

export type JobMarketInsightCachedFeed = JobMarketInsightMetrics

export type { SkillExperienceLevel } from './skillExperienceLevel'

export type MySkill = {
  id: string
  name: string
  level: SkillExperienceLevel
  comment: string | null
}

export type MySkillsFeed = {
  skills: MySkill[]
}

export type CvData = {
  modifiedAt: string
  text: string
  hash: string
}

export type CvFeed = {
  cv: CvData | null
}

export type CvCachedFeed = Record<string, never>

export function emptyJobAdApplication(): JobAdApplication {
  return {
    status: DEFAULT_JOB_APPLY_STATUS,
    archiveReason: null,
    comment: null,
    appliedAt: null,
    rejectedAt: null,
    statusChangedAt: null,
  }
}

export function emptyJobAdMeta(): JobAdMeta {
  return {
    application: emptyJobAdApplication(),
    fav: false,
    isCurrentCVUsed: false,
  }
}

export function jobAdApplicationFromMeta(meta: JobAdApplicationMeta): JobAdApplication {
  return {
    status: meta.applyStatus,
    archiveReason: meta.archiveReason,
    comment: meta.comment,
    appliedAt: meta.appliedAt,
    rejectedAt: meta.rejectedAt,
    statusChangedAt: meta.statusChangedAt,
  }
}

export function jobAdApplicationMetaFromApplication(application: JobAdApplication): JobAdApplicationMeta {
  return {
    applyStatus: application.status,
    archiveReason: application.archiveReason,
    comment: application.comment,
    appliedAt: application.appliedAt,
    rejectedAt: application.rejectedAt,
    statusChangedAt: application.statusChangedAt,
  }
}

export function isJobAdApplied(item: Pick<JobAdsFeedItem, 'meta'>): boolean {
  return item.meta.application.appliedAt !== null
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

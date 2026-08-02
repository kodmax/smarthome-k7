import { CvSource } from './cv'
import { JobAdsSource } from './job-ads'
import { JobMarketInsightSource } from './job-market-insight'
import { MySkillsSource } from './my-skills'
import { NewsSource } from './news'
import { SentryTestSource } from './sentry-test'
import { CnbcForexSource, CnbcMarketIndicesSource, NasdaqMarketDataSource, YahooMarketDataSource } from './stock-market'
import { TorrentSource } from './the-pirate-bay'
import { TransmissionSource } from './transmission'
import { WeatherSource } from './weather'

export type DataSourceRegistryType = {
  weather: typeof WeatherSource
  nasdaqMarketData: typeof NasdaqMarketDataSource
  yahooMarketData: typeof YahooMarketDataSource
  cnbcMarketIndices: typeof CnbcMarketIndicesSource
  cnbcForex: typeof CnbcForexSource
  news: typeof NewsSource
  jobAds: typeof JobAdsSource
  mySkills: typeof MySkillsSource
  jobMarketInsight: typeof JobMarketInsightSource
  cv: typeof CvSource
  torrents: typeof TorrentSource
  transmission: typeof TransmissionSource
  sentryTest: typeof SentryTestSource
}

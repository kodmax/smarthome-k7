import { DataSourceRegistry, FeedComposer } from '@repo/feeds'
import { addFxRatesFeed } from './fx-rates'
import { addJobMarketInsightFeed } from './job-market-insight'
import { addJobAdsFeed } from './job-ads'
import { addMySkillsFeed } from './my-skills'
import { addCvFeed } from './cv'
import { addNewsFeed } from './news'
import { addStockMarketFeed } from './stock-market'
import { addTopTorrentsFeed } from './top-torrents'
import { addTransmissionFeed } from './transmission'
import { addWeatherFeed } from './weather'
import { addSentryTestFeed } from './sentry-test'
import {
  CnbcForexSource,
  CnbcMarketIndicesSource,
  CvSource,
  DataSourceRegistryType,
  JobAdsSource,
  JobMarketInsightSource,
  MySkillsSource,
  NasdaqMarketDataSource,
  NewsSource,
  SentryTestSource,
  TorrentSource,
  TransmissionSource,
  WeatherSource,
  YahooMarketDataSource,
} from '@/data-sources'

export const initWebFeeds = async (
  feeds: FeedComposer,
  dataSources: DataSourceRegistry<DataSourceRegistryType>,
): Promise<void> => {
  await dataSources.add('weather', WeatherSource)
  await dataSources.add('nasdaqMarketData', NasdaqMarketDataSource)
  await dataSources.add('yahooMarketData', YahooMarketDataSource)
  await dataSources.add('cnbcMarketIndices', CnbcMarketIndicesSource)
  await dataSources.add('cnbcForex', CnbcForexSource)
  await dataSources.add('news', NewsSource)
  await dataSources.add('jobAds', JobAdsSource)
  await dataSources.add('jobMarketInsight', JobMarketInsightSource)
  await dataSources.add('mySkills', MySkillsSource)
  await dataSources.add('cv', CvSource)
  await dataSources.add('torrents', TorrentSource)
  await dataSources.add('transmission', TransmissionSource)
  await dataSources.add('sentryTest', SentryTestSource)

  await Promise.all([
    addWeatherFeed(feeds, dataSources),
    addStockMarketFeed(feeds, dataSources),
    addFxRatesFeed(feeds, dataSources),
    addNewsFeed(feeds, dataSources),
    addJobAdsFeed(feeds, dataSources),
    addJobMarketInsightFeed(feeds, dataSources),
    addMySkillsFeed(feeds, dataSources),
    addCvFeed(feeds, dataSources),
    addTopTorrentsFeed(feeds, dataSources),
    addTransmissionFeed(feeds, dataSources),
    addSentryTestFeed(feeds, dataSources),
  ])
}

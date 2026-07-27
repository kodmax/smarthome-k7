import { Feeds } from '@repo/apollo-ws'
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

export const initWebFeeds = async (feeds: Feeds): Promise<void> => {
  await Promise.all([
    addWeatherFeed(feeds),
    addStockMarketFeed(feeds),
    addFxRatesFeed(feeds),
    addNewsFeed(feeds),
    addJobAdsFeed(feeds),
    addJobMarketInsightFeed(feeds),
    addMySkillsFeed(feeds),
    addCvFeed(feeds),
    addTopTorrentsFeed(feeds),
    addTransmissionFeed(feeds),
    addSentryTestFeed(feeds),
  ])
}

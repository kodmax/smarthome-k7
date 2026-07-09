import { Feeds } from '@repo/apollo-ws'
import { addJobsFeed } from './jobs'
import { addNewsFeed } from './news'
import { addStockMarketFeed } from './stock-market'
import { addTopTorrentsFeed } from './top-torrents'
import { addTransmissionFeed } from './transmission'
import { addWeatherFeed } from './weather'

export const initWebFeeds = async (feeds: Feeds): Promise<void> => {
  await Promise.all([
    addWeatherFeed(feeds),
    addStockMarketFeed(feeds),
    addNewsFeed(feeds),
    addJobsFeed(feeds),
    addTopTorrentsFeed(feeds),
    addTransmissionFeed(feeds),
  ])
}

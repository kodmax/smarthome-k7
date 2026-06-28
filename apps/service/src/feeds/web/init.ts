import { Feeds } from '@repo/apollo-ws'
import { addJobsFeed } from './jobs'
import { addNewsFeed } from './news'
import { addStockMarketFeed } from './stock-market'
import { addTopTorrentsFeed } from './top-torrents'
import { addWeatherFeed } from './weather'

export const initWebFeeds = (feeds: Feeds): void => {
  addWeatherFeed(feeds)
  addStockMarketFeed(feeds)
  addNewsFeed(feeds)
  addJobsFeed(feeds)
  addTopTorrentsFeed(feeds)
}

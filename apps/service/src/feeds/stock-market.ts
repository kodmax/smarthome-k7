import { Feeds } from '@repo/apollo-ws'
import { StockMarketFeed, TickerData } from '@repo/types'
import { YahooTickerData } from '../data-sources/stock-market/yahoo/types'
import { nasdaqMarketData, yahooMarketData } from '../data-sources'

export const addStockMarketFeed = (feeds: Feeds): void => {
  feeds.addFeed(
    'stock-market',
    { nasdaqMarketData, yahooMarketData },
    ({ nasdaqMarketData, yahooMarketData }): StockMarketFeed => {
      const yahooData: Map<string, YahooTickerData> = new Map()
      for (const tickerData of yahooMarketData) {
        yahooData.set(tickerData.ticker, tickerData)
      }

      const tickers: TickerData[] = []
      for (const nasdaq of nasdaqMarketData) {
        const yahoo = yahooData.get(nasdaq.ticker)
        if (yahoo === undefined) {
          throw new Error('Missing Yahoo ticker data')
        }

        const priceTarget =
          yahoo.quoteSummary.priceTarget.last7days ??
          yahoo.quoteSummary.priceTarget.last30days ??
          yahoo.oneYearPriceTarget

        const eg = priceTarget !== null ? (priceTarget / nasdaq.price.lastTradePrice - 1) * 100 : null

        tickers.push({
          symbol: nasdaq.ticker,
          title: nasdaq.title,
          marketCap: yahoo.marketCap,
          exchange: {
            name: nasdaq.exchange,
            status: nasdaq.marketStatus,
          },
          price: {
            lastTradeTimestamp: nasdaq.price.lastTradeTimestamp,
            lastTradePrice: nasdaq.price.lastTradePrice,
            netChange: nasdaq.price.netChange,
            percentageChange: nasdaq.price.percentageChange,
            oneYearTarget: yahoo.oneYearPriceTarget,
            priceTarget,
            eg,
          },
          statistics: {
            trailingEPS: yahoo.trailingEPS,
            forwardEPS: yahoo.forwardEPS,
          },
          earningsDate: {
            confirmed: yahoo.earningsDate.confirmed,
            estimated: yahoo.earningsDate.estimated,
          },
          quoteSummary: yahoo.quoteSummary,
        })
      }

      return { tickers }
    },
  )
}

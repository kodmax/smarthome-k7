import { Feeds } from '@repo/apollo-ws'
import { StockMarketFeed, TickerData } from '@repo/types'
import { YahooTickerData } from '@/data-sources/stock-market/yahoo/types'
import { nasdaqMarketData, yahooMarketData, nasdaqEPSData } from '@/data-sources'
import { NasdaqTickerData } from '@/data-sources/stock-market/nasdaq/types'
import { NasdaqEPSData } from '@/data-sources/stock-market/nasdaq-eps/types'
import { tickerList } from '@/data-sources/stock-market/tickerList'

export const addStockMarketFeed = (feeds: Feeds): void => {
  feeds.addFeed(
    'stock-market',
    { nasdaqMarketData, yahooMarketData, nasdaqEPSData },
    ({ nasdaqMarketData, yahooMarketData, nasdaqEPSData }): StockMarketFeed => {
      const yahooMap: Map<string, YahooTickerData> = new Map()
      for (const data of yahooMarketData) {
        yahooMap.set(data.ticker, data)
      }

      const nasdaqMap: Map<string, NasdaqTickerData> = new Map()
      for (const data of nasdaqMarketData) {
        nasdaqMap.set(data.ticker, data)
      }

      const nasdaqEPSMap: Map<string, NasdaqEPSData> = new Map()
      for (const data of nasdaqEPSData) {
        nasdaqEPSMap.set(data.ticker, data)
      }

      const tickers: TickerData[] = []
      for (const symbol of tickerList) {
        const yahoo = yahooMap.get(symbol)
        if (yahoo === undefined) {
          throw new Error(`Missing Yahoo ticker data for ${symbol}`)
        }

        const nasdaq = nasdaqMap.get(symbol)
        if (nasdaq === undefined) {
          throw new Error(`Missing Nasdaq ticker data for ${symbol}`)
        }

        const nasdaqEPS = nasdaqEPSMap.get(symbol)
        if (nasdaqEPS === undefined) {
          throw new Error(`Missing Nasdaq EPS ticker data for ${symbol}`)
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
          eps: {
            forecast: nasdaqEPS.forecast,
            ttm: nasdaqEPS.ttm,
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

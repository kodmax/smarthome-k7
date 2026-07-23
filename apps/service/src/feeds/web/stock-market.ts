import { Feeds } from '@repo/apollo-ws'
import { StockMarketFeed, TickerData } from '@repo/types'
import { YahooTickerData } from '@/data-sources/stock-market/yahoo/types'
import { CnbcMarketIndicesSource, NasdaqMarketDataSource, YahooMarketDataSource } from '@/data-sources'
import { NasdaqTickerData } from '@/data-sources/stock-market/nasdaq/types'
import { tickerList } from '@/data-sources/stock-market/tickerList'

export const addStockMarketFeed = (feeds: Feeds): Promise<void> =>
  feeds.addFeed(
    'stock-market',
    {
      nasdaqMarketData: NasdaqMarketDataSource,
      yahooMarketData: YahooMarketDataSource,
      cnbcMarketIndices: CnbcMarketIndicesSource,
    },
    ({ nasdaqMarketData, yahooMarketData, cnbcMarketIndices }): StockMarketFeed => {
      const yahooMap: Map<string, YahooTickerData> = new Map()
      for (const data of yahooMarketData) {
        yahooMap.set(data.ticker, data)
      }

      const nasdaqMap: Map<string, NasdaqTickerData> = new Map()
      for (const data of nasdaqMarketData.tickers) {
        nasdaqMap.set(data.ticker, data)
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

        const priceTarget =
          yahoo.quoteSummary.priceTarget.last7days ??
          yahoo.quoteSummary.priceTarget.last30days ??
          yahoo.oneYearPriceTarget

        const eg = priceTarget !== null ? (priceTarget / nasdaq.price.lastTradePrice - 1) * 100 : null

        tickers.push({
          symbol: nasdaq.ticker,
          title: nasdaq.title,
          marketCap: yahoo.marketCap,
          exchange: nasdaq.exchange,
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

      return { marketInfo: nasdaqMarketData.marketInfo, marketIndices: cnbcMarketIndices, tickers }
    },
  )

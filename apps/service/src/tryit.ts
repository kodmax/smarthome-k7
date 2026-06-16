import { nasdaqMarketData } from './data-sources/stock-market/nasdaq'

nasdaqMarketData.script().then(stockMarket => {
  for (const ticker of stockMarket) {
    console.log(ticker)
  }
})

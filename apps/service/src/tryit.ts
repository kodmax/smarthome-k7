import { source } from './data-sources/stock-market'

source.script().then(stockMarket => {
  for (const ticker of stockMarket.tickers) {
    console.log(ticker)
  }
})

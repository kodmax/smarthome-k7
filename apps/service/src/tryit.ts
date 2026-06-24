import { getTickerData } from './data-sources/stock-market/yahoo/src'

getTickerData('WDC').then(data => console.log(data))

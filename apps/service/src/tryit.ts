import { getTickerData } from './data-sources/stock-market/yahoo/src'

getTickerData('MU').then(data => console.log(data))

import { fetchDocument } from '@/fetch'
import { parseBtcPriceFromDocument } from './parseFromDocument'

type BtcPrice = {
  usd: string
}

const fetchBtcPrice = async (): Promise<BtcPrice> => {
  return fetchDocument('https://www.cnbc.com/quotes/BTC.BS=', { accept: 'text/html' }).then(parseBtcPriceFromDocument)
}

export type { BtcPrice }
export { fetchBtcPrice }

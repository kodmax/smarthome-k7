import { fetchDocument } from '@/fetch'
import { parseGoldPriceFromDocument } from './parseFromDocument'

type GoldPrice = {
  g: string
  oz: string
}

const fetchGoldPrice = (): Promise<GoldPrice> => {
  return fetchDocument('https://markets.businessinsider.com/commodities/gold-price', { accept: 'text/html' }).then(
    parseGoldPriceFromDocument,
  )
}

export type { GoldPrice }
export { fetchGoldPrice }

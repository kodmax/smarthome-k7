import { fetchDocument } from '@/fetch'
import { parseOilPriceFromDocument } from './parseFromDocument'

type OilPrice = {
  l: string
}

const fetchOilPrice = async (): Promise<OilPrice> => {
  return fetchDocument('https://www.cnbc.com/quotes/@CL.1', { accept: 'text/html' }).then(parseOilPriceFromDocument)
}

export type { OilPrice }
export { fetchOilPrice }

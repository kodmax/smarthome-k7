import { getNumberContent } from '../utils/get-number-content'
import { fetchDocument } from '@/fetch'

type OilPrice = {
  l: string
}

const fetchOilPrice = async (): Promise<OilPrice> => {
  return fetchDocument('https://www.cnbc.com/quotes/@CL.1', { accept: 'text/html' }).then(document => {
    return {
      l: (getNumberContent(document.body, '.QuoteStrip-lastPrice') / 159).toFixed(2),
    }
  })
}

export type { OilPrice }
export { fetchOilPrice }

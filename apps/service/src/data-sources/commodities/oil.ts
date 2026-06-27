import { getNumberContent } from '../utils/get-number-content'
import { getHTML } from '@/fetch'

type OilPrice = {
  l: string
}

const fetchOilPrice = async (): Promise<OilPrice> => {
  return getHTML('https://www.cnbc.com/quotes/@CL.1', { accept: 'text/html' }).then(document => {
    return {
      l: (getNumberContent(document.body, '.QuoteStrip-lastPrice') / 159).toFixed(2),
    }
  })
}

export type { OilPrice }
export { fetchOilPrice }

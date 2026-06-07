import { getNumberContent } from '../utils/get-number-content'
import { myFetch } from '../../fetch'
import { parseHTML } from 'linkedom'

type OilPrice = {
  l: string
}

const fetchOilPrice = async (): Promise<OilPrice> => {
  return myFetch('https://www.cnbc.com/quotes/@CL.1', { accept: 'text/html' })
    .then(response => response.toString('utf-8'))
    .then(html => {
      const document = parseHTML(html).window.document

      return {
        l: (getNumberContent(document.body, '.QuoteStrip-lastPrice') / 159).toFixed(2),
      }
    })
}

export type { OilPrice }
export { fetchOilPrice }

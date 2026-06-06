import { getNumberContent } from '../utils/get-number-content'
import { myFetch } from '../../fetch'
import { parseHTML } from 'linkedom'

type CoalPrice = {
  ton: string
  history?: History
}

const fetchCoalPrice = async (): Promise<CoalPrice> => {
  return myFetch('https://markets.businessinsider.com/commodities/coal-price', { accept: 'text/html' })
    .then(response => response.toString('utf-8'))
    .then(html => {
      const document = parseHTML(html).window.document

      return {
        ton: getNumberContent(document.body, '.price-section__current-value').toFixed(0),
      }
    })
}

export type { CoalPrice }
export { fetchCoalPrice }

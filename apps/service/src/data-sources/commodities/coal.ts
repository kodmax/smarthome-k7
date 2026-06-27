import { getNumberContent } from '../utils/get-number-content'
import { getHTML } from '../../fetch'

type CoalPrice = {
  ton: string
}

const fetchCoalPrice = async (): Promise<CoalPrice> => {
  return getHTML('https://markets.businessinsider.com/commodities/coal-price', { accept: 'text/html' }).then(
    document => {
      return {
        ton: getNumberContent(document.body, '.price-section__current-value').toFixed(0),
      }
    },
  )
}

export type { CoalPrice }
export { fetchCoalPrice }

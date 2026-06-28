import { getNumberContent } from '../utils/get-number-content'
import { fetchDocument } from '@/fetch'

type NaturalGasPrice = {
  GJ: string
  MWh: string
  MMBTU: string
}

const fetchNaturalGasPrice = async (): Promise<NaturalGasPrice> => {
  return fetchDocument('https://www.cnbc.com/quotes/@NG.1', { accept: 'text/html' }).then(document => {
    // 1 MWh = 3.412142 MMBTU = 3.6 GJ
    const price = getNumberContent(document.body, '.QuoteStrip-lastPrice')
    return {
      GJ: Number((price * 3.412142) / 3.6).toFixed(2),
      MWh: Number(price * 3.412142).toFixed(2),
      MMBTU: price.toFixed(2),
    }
  })
}

export type { NaturalGasPrice }
export { fetchNaturalGasPrice }

import { fetchDocument } from '@/fetch'
import { CnbcForexData } from './types'
import { parseFXFromDocument } from './parseFX'

const USD_PLN_URL = 'https://www.cnbc.com/quotes/PLN='
const EUR_PLN_URL = 'https://www.cnbc.com/quotes/EURPLN='

export const getForexRates = async (): Promise<CnbcForexData> => {
  const [usdPlnDocument, eurPlnDocument] = await Promise.all([
    fetchDocument(USD_PLN_URL, { accept: 'text/html' }),
    fetchDocument(EUR_PLN_URL, { accept: 'text/html' }),
  ])

  return {
    usdPln: parseFXFromDocument(usdPlnDocument, 'PLN=', 'USD/PLN'),
    eurPln: parseFXFromDocument(eurPlnDocument, 'EURPLN=', 'EUR/PLN'),
  }
}

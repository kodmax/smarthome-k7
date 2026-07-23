import { fetchDocument } from '@/fetch'
import { CnbcMarketIndicesData } from './types'
import { parseMarketIndexQuoteFromDocument } from './parseMarketIndexQuote'

const SP500_URL = 'https://www.cnbc.com/quotes/.SPX'
const SP500_FUTURES_URL = 'https://www.cnbc.com/quotes/@SP.1'

export const getMarketIndexQuotes = async (): Promise<CnbcMarketIndicesData> => {
  const [sp500Document, sp500FuturesDocument] = await Promise.all([
    fetchDocument(SP500_URL, { accept: 'text/html' }),
    fetchDocument(SP500_FUTURES_URL, { accept: 'text/html' }),
  ])

  return {
    sp500: parseMarketIndexQuoteFromDocument(sp500Document, '.SPX', 'S&P 500'),
    sp500Futures: parseMarketIndexQuoteFromDocument(sp500FuturesDocument, '@SP.1', 'S&P 500 Futures'),
  }
}

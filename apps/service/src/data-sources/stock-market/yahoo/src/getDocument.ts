import { getHTML } from '../../../../fetch'

export const getDocument = async (ticker: string, section?: string): Promise<Document> => {
  return getHTML(
    section !== undefined
      ? `https://finance.yahoo.com/quote/${ticker}/${section}/`
      : `https://finance.yahoo.com/quote/${ticker}/`,
    { accept: 'text/html' },
  )
}

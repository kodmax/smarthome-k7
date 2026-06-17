import { parseHTML } from 'linkedom'

export const getDocument = async (ticker: string, section?: string): Promise<Document> => {
  const req = fetch(
    section !== undefined
      ? `https://finance.yahoo.com/quote/${ticker}/${section}/`
      : `https://finance.yahoo.com/quote/${ticker}/`,
  )

  return req
    .then(resp => resp.text())
    .then(html => parseHTML(html))
    .then(window => window.document)
}

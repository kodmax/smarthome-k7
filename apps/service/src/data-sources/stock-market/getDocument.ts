import { parseHTML } from 'linkedom'

export const getDocument = async (ticker: string): Promise<Document> => {
  console.log(`Fetching ${ticker} ticker data`)
  const req = fetch(`https://finance.yahoo.com/quote/${ticker}/`)
  return req
    .then(resp => resp.text())
    .then(html => parseHTML(html))
    .then(window => window.document)
}

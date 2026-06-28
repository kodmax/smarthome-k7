import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { getApiData } from './getAPIData'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

const loadDocument = (filename: string): Document => {
  const html = readFileSync(path.join(fixturesDir, filename), 'utf8')
  return parseHTML(html).window.document
}

describe('getApiData', () => {
  it('extracts JSON body from sveltekit prefetched script', () => {
    const document = loadDocument('api-data.html')

    expect(
      getApiData<{ price: { regularMarketPrice: number } }>(
        document,
        'https://query1.finance.yahoo.com/v10/finance/quoteSummary/AAPL',
      ),
    ).toEqual({ price: { regularMarketPrice: 123.45 } })
  })

  it('throws when script is missing', () => {
    const document = parseHTML('<div></div>').window.document

    expect(() => getApiData(document, 'https://query1.finance.yahoo.com/v10/finance/quoteSummary/AAPL')).toThrow(
      'API Data script not found',
    )
  })
})

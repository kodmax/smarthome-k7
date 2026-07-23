import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it, vi } from 'vitest'
import { getForexRates } from './getForexRates'

vi.mock('@/fetch', () => ({
  fetchDocument: vi.fn(),
}))

const { fetchDocument } = await import('@/fetch')

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

describe('getForexRates', () => {
  it('parses USD/PLN and EUR/PLN quotes from CNBC HTML', async () => {
    const usdPlnHtml = readFileSync(path.join(fixturesDir, 'pln.html'), 'utf8')
    const eurPlnHtml = readFileSync(path.join(fixturesDir, 'eurpln.html'), 'utf8')
    vi.mocked(fetchDocument).mockImplementation(async url => {
      if (url === 'https://www.cnbc.com/quotes/PLN=') {
        return parseHTML(usdPlnHtml).window.document
      }
      if (url === 'https://www.cnbc.com/quotes/EURPLN=') {
        return parseHTML(eurPlnHtml).window.document
      }
      throw new Error(`Unexpected URL: ${url}`)
    })

    await expect(getForexRates()).resolves.toEqual({
      usdPln: {
        symbol: 'PLN=',
        title: 'USD/PLN',
        price: 3.8056,
        netChange: 0.0172,
        percentageChange: 0.45,
      },
      eurPln: {
        symbol: 'EURPLN=',
        title: 'EUR/PLN',
        price: 4.33,
        netChange: 0.0074,
        percentageChange: 0.17,
      },
    })
  })
})

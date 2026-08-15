import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchError } from '@/fetch/FetchError'
import { getForexRates } from './getForexRates'

vi.mock('@/fetch', () => ({
  fetchDocument: vi.fn(),
}))

const { fetchDocument } = await import('@/fetch')

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')
const EUR_PLN_URL = 'https://www.cnbc.com/quotes/EURPLN='

describe('getForexRates', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

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

  it('retries failed CNBC fetches up to three times', async () => {
    const eurPlnHtml = readFileSync(path.join(fixturesDir, 'eurpln.html'), 'utf8')
    const eurPlnDocument = parseHTML(eurPlnHtml).window.document
    let usdPlnAttempts = 0

    vi.mocked(fetchDocument).mockImplementation(async url => {
      if (url === 'https://www.cnbc.com/quotes/PLN=') {
        usdPlnAttempts += 1
        if (usdPlnAttempts < 3) {
          throw new FetchError(url, 'Not Found', 404)
        }
        return parseHTML(readFileSync(path.join(fixturesDir, 'pln.html'), 'utf8')).window.document
      }
      if (url === 'https://www.cnbc.com/quotes/EURPLN=') {
        return eurPlnDocument
      }
      throw new Error(`Unexpected URL: ${url}`)
    })

    const resultPromise = getForexRates()
    await vi.advanceTimersByTimeAsync(3000)
    await vi.advanceTimersByTimeAsync(6000)
    await expect(resultPromise).resolves.toEqual({
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
    expect(usdPlnAttempts).toBe(3)
  })

  it('fails after three unsuccessful CNBC fetch attempts', async () => {
    vi.mocked(fetchDocument).mockRejectedValue(new FetchError(EUR_PLN_URL, 'Not Found', 404))

    const resultPromise = getForexRates()
    const expectation = expect(resultPromise).rejects.toBeInstanceOf(FetchError)
    await vi.advanceTimersByTimeAsync(3000)
    await vi.advanceTimersByTimeAsync(6000)
    await expectation
    expect(fetchDocument).toHaveBeenCalledTimes(3)
  })
})

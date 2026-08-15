import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchError } from '@/fetch/FetchError'
import { getForexRates } from './getForexRates'

vi.mock('./yahoo/src/getChartQuote', () => ({
  getChartQuote: vi.fn(),
}))

const { getChartQuote } = await import('./yahoo/src/getChartQuote')

const usdPlnQuote = {
  symbol: 'USDPLN=X',
  title: 'USD/PLN',
  price: 3.719,
  netChange: -0.016799999999999926,
  percentageChange: -0.44970287488623395,
}

const eurPlnQuote = {
  symbol: 'EURPLN=X',
  title: 'EUR/PLN',
  price: 4.3039,
  netChange: -0.0036000000000004917,
  percentageChange: -0.08357515960535095,
}

describe('getForexRates', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    vi.mocked(getChartQuote).mockImplementation(async request => {
      if (request.chartSymbol === 'USDPLN=X') {
        return usdPlnQuote
      }
      if (request.chartSymbol === 'EURPLN=X') {
        return eurPlnQuote
      }
      throw new Error(`Unexpected chart symbol: ${request.chartSymbol}`)
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetches USD/PLN and EUR/PLN quotes', async () => {
    await expect(getForexRates()).resolves.toEqual({
      usdPln: usdPlnQuote,
      eurPln: eurPlnQuote,
    })
    expect(getChartQuote).toHaveBeenCalledWith({
      symbol: 'USDPLN=X',
      title: 'USD/PLN',
      chartSymbol: 'USDPLN=X',
    })
    expect(getChartQuote).toHaveBeenCalledWith({
      symbol: 'EURPLN=X',
      title: 'EUR/PLN',
      chartSymbol: 'EURPLN=X',
    })
  })

  it('retries failed fetches up to three times', async () => {
    let usdPlnAttempts = 0

    vi.mocked(getChartQuote).mockImplementation(async request => {
      if (request.chartSymbol === 'USDPLN=X') {
        usdPlnAttempts += 1
        if (usdPlnAttempts < 3) {
          throw new FetchError(
            `https://query1.finance.yahoo.com/v8/finance/chart/${request.chartSymbol}`,
            'Not Found',
            404,
          )
        }
        return usdPlnQuote
      }
      return eurPlnQuote
    })

    const resultPromise = getForexRates()
    await vi.advanceTimersByTimeAsync(3000)
    await vi.advanceTimersByTimeAsync(6000)
    await expect(resultPromise).resolves.toEqual({
      usdPln: usdPlnQuote,
      eurPln: eurPlnQuote,
    })
    expect(usdPlnAttempts).toBe(3)
  })

  it('fails after three unsuccessful fetch attempts', async () => {
    vi.mocked(getChartQuote).mockRejectedValue(
      new FetchError('https://query1.finance.yahoo.com/v8/finance/chart/USDPLN=X', 'Not Found', 404),
    )

    const resultPromise = getForexRates()
    const expectation = expect(resultPromise).rejects.toBeInstanceOf(FetchError)
    await vi.advanceTimersByTimeAsync(3000)
    await vi.advanceTimersByTimeAsync(6000)
    await expectation
    expect(getChartQuote).toHaveBeenCalledTimes(6)
  })
})

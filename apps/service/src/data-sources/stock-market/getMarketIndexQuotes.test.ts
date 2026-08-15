import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { FetchError } from '@/fetch/FetchError'
import { getMarketIndexQuotes } from './getMarketIndexQuotes'

vi.mock('./yahoo/src/getChartQuote', () => ({
  getChartQuote: vi.fn(),
}))

const { getChartQuote } = await import('./yahoo/src/getChartQuote')

const sp500Quote = {
  symbol: '^GSPC',
  title: 'S&P 500',
  price: 7785.76,
  netChange: -13.229999999999563,
  percentageChange: -0.16963735047742803,
}

const sp500FuturesQuote = {
  symbol: 'ES=F',
  title: 'S&P 500 Futures',
  price: 7805.0,
  netChange: -17.5,
  percentageChange: -0.22371364653243847,
}

describe('getMarketIndexQuotes', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    vi.mocked(getChartQuote).mockImplementation(async request => {
      if (request.chartSymbol === '^GSPC') {
        return sp500Quote
      }
      if (request.chartSymbol === 'ES=F') {
        return sp500FuturesQuote
      }
      throw new Error(`Unexpected chart symbol: ${request.chartSymbol}`)
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('fetches S&P 500 and S&P 500 futures quotes', async () => {
    await expect(getMarketIndexQuotes()).resolves.toEqual({
      sp500: sp500Quote,
      sp500Futures: sp500FuturesQuote,
    })
    expect(getChartQuote).toHaveBeenCalledWith({
      symbol: '^GSPC',
      title: 'S&P 500',
      chartSymbol: '^GSPC',
    })
    expect(getChartQuote).toHaveBeenCalledWith({
      symbol: 'ES=F',
      title: 'S&P 500 Futures',
      chartSymbol: 'ES=F',
    })
  })

  it('retries failed fetches up to three times', async () => {
    let sp500Attempts = 0

    vi.mocked(getChartQuote).mockImplementation(async request => {
      if (request.chartSymbol === '^GSPC') {
        sp500Attempts += 1
        if (sp500Attempts < 3) {
          throw new FetchError(
            `https://query1.finance.yahoo.com/v8/finance/chart/${request.chartSymbol}`,
            'Not Found',
            404,
          )
        }
        return sp500Quote
      }
      return sp500FuturesQuote
    })

    const resultPromise = getMarketIndexQuotes()
    await vi.advanceTimersByTimeAsync(3000)
    await vi.advanceTimersByTimeAsync(6000)
    await expect(resultPromise).resolves.toEqual({
      sp500: sp500Quote,
      sp500Futures: sp500FuturesQuote,
    })
    expect(sp500Attempts).toBe(3)
  })

  it('fails after three unsuccessful fetch attempts', async () => {
    vi.mocked(getChartQuote).mockRejectedValue(
      new FetchError('https://query1.finance.yahoo.com/v8/finance/chart/%5EGSPC', 'Not Found', 404),
    )

    const resultPromise = getMarketIndexQuotes()
    const expectation = expect(resultPromise).rejects.toBeInstanceOf(FetchError)
    await vi.advanceTimersByTimeAsync(3000)
    await vi.advanceTimersByTimeAsync(6000)
    await expectation
    expect(getChartQuote).toHaveBeenCalledTimes(6)
  })
})

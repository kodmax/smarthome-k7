import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parseChartQuote } from './parseChartQuote'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

describe('parseChartQuote', () => {
  it('parses EUR/PLN quote from Yahoo chart response', () => {
    const response = JSON.parse(readFileSync(path.join(fixturesDir, 'eurpln-chart.json'), 'utf8'))

    expect(
      parseChartQuote(response, {
        symbol: 'EURPLN=X',
        title: 'EUR/PLN',
        chartSymbol: 'EURPLN=X',
      }),
    ).toEqual({
      symbol: 'EURPLN=X',
      title: 'EUR/PLN',
      price: 4.3039,
      netChange: -0.0036000000000004917,
      percentageChange: -0.08357515960535095,
    })
  })

  it('parses USD/PLN quote from Yahoo chart response', () => {
    const response = JSON.parse(readFileSync(path.join(fixturesDir, 'usdpln-chart.json'), 'utf8'))

    expect(
      parseChartQuote(response, {
        symbol: 'USDPLN=X',
        title: 'USD/PLN',
        chartSymbol: 'USDPLN=X',
      }),
    ).toEqual({
      symbol: 'USDPLN=X',
      title: 'USD/PLN',
      price: 3.719,
      netChange: -0.016799999999999926,
      percentageChange: -0.44970287488623395,
    })
  })

  it('parses S&P 500 quote from Yahoo chart response', () => {
    const response = JSON.parse(readFileSync(path.join(fixturesDir, 'gspc-chart.json'), 'utf8'))

    expect(
      parseChartQuote(response, {
        symbol: '^GSPC',
        title: 'S&P 500',
        chartSymbol: '^GSPC',
      }),
    ).toEqual({
      symbol: '^GSPC',
      title: 'S&P 500',
      price: 7785.76,
      netChange: -13.229999999999563,
      percentageChange: -0.16963735047742803,
    })
  })

  it('parses S&P 500 futures quote from Yahoo chart response', () => {
    const response = JSON.parse(readFileSync(path.join(fixturesDir, 'es-f-chart.json'), 'utf8'))

    expect(
      parseChartQuote(response, {
        symbol: 'ES=F',
        title: 'S&P 500 Futures',
        chartSymbol: 'ES=F',
      }),
    ).toEqual({
      symbol: 'ES=F',
      title: 'S&P 500 Futures',
      price: 7805.0,
      netChange: -17.5,
      percentageChange: -0.22371364653243847,
    })
  })

  it('throws when price data is missing', () => {
    expect(() =>
      parseChartQuote(
        { chart: { result: [{ meta: {} }] } },
        { symbol: 'EURPLN=X', title: 'EUR/PLN', chartSymbol: 'EURPLN=X' },
      ),
    ).toThrow('missing price data for EURPLN=X')
  })
})

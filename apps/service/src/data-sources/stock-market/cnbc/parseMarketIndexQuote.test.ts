import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { parseMarketIndexQuoteFromDocument } from './parseMarketIndexQuote'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

const loadDocument = (filename: string): Document => {
  const html = readFileSync(path.join(fixturesDir, filename), 'utf8')
  return parseHTML(html).window.document
}

describe('parseMarketIndexQuoteFromDocument', () => {
  it('parses S&P 500 index quote from CNBC HTML', () => {
    expect(parseMarketIndexQuoteFromDocument(loadDocument('spx.html'), '.SPX', 'S&P 500')).toEqual({
      symbol: '.SPX',
      title: 'S&P 500',
      price: 7498.96,
      netChange: -10.24,
      percentageChange: -0.14,
    })
  })

  it('parses S&P 500 futures quote from CNBC HTML', () => {
    expect(parseMarketIndexQuoteFromDocument(loadDocument('sp-futures.html'), '@SP.1', 'S&P 500 Futures')).toEqual({
      symbol: '@SP.1',
      title: 'S&P 500 Futures',
      price: 7512.25,
      netChange: -28,
      percentageChange: -0.37,
    })
  })

  it('throws when quote price is missing', () => {
    expect(() =>
      parseMarketIndexQuoteFromDocument(parseHTML('<div></div>').window.document, '.SPX', 'S&P 500'),
    ).toThrow('cnbc:.SPX: ".QuoteStrip-lastPrice" not found')
  })
})

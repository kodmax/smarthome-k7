import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { parseFXFromDocument } from './parseFX'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

const loadDocument = (filename: string): Document => {
  const html = readFileSync(path.join(fixturesDir, filename), 'utf8')
  return parseHTML(html).window.document
}

describe('parseFXFromDocument', () => {
  it('parses USD/PLN quote from CNBC HTML', () => {
    expect(parseFXFromDocument(loadDocument('pln.html'), 'PLN=', 'USD/PLN')).toEqual({
      symbol: 'PLN=',
      title: 'USD/PLN',
      price: 3.8056,
      netChange: 0.0172,
      percentageChange: 0.45,
    })
  })

  it('parses EUR/PLN quote from CNBC HTML', () => {
    expect(parseFXFromDocument(loadDocument('eurpln.html'), 'EURPLN=', 'EUR/PLN')).toEqual({
      symbol: 'EURPLN=',
      title: 'EUR/PLN',
      price: 4.33,
      netChange: 0.0074,
      percentageChange: 0.17,
    })
  })

  it('throws when quote price is missing', () => {
    expect(() => parseFXFromDocument(parseHTML('<div></div>').window.document, 'PLN=', 'USD/PLN')).toThrow(
      'cnbc:PLN=: ".QuoteStrip-lastPrice" not found',
    )
  })
})

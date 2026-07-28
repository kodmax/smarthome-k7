import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { parseQuoteFieldsFromDocument } from './parseQuoteFromDocument'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

const loadDocument = (filename: string): Document => {
  const html = readFileSync(path.join(fixturesDir, filename), 'utf8')
  return parseHTML(html).window.document
}

describe('parseQuoteFieldsFromDocument', () => {
  it('parses quote fields from JSON-LD FinancialQuote', () => {
    expect(parseQuoteFieldsFromDocument(loadDocument('spx-jsonld.html'))).toEqual({
      price: 7413.18,
      netChange: 1.2,
      percentageChange: 0.02,
    })
  })

  it('parses unchanged quote from DOM fallback', () => {
    expect(parseQuoteFieldsFromDocument(loadDocument('spx-unchanged.html'))).toEqual({
      price: 7413.18,
      netChange: 0,
      percentageChange: 0,
    })
  })

  it('parses nested CNBC change markup from DOM fallback', () => {
    expect(parseQuoteFieldsFromDocument(loadDocument('spx-nested.html'))).toEqual({
      price: 7413.18,
      netChange: 1.2,
      percentageChange: 0.02,
    })
  })

  it('throws when neither JSON-LD nor DOM change data is available', () => {
    expect(() =>
      parseQuoteFieldsFromDocument(parseHTML('<div class="QuoteStrip-lastPrice">100</div>').window.document),
    ).toThrow('missing ".QuoteStrip-changeUp, .QuoteStrip-changeDown, .QuoteStrip-unchanged" in quote change')
  })

  it('throws when quote price is missing and JSON-LD is unavailable', () => {
    expect(() => parseQuoteFieldsFromDocument(parseHTML('<div></div>').window.document)).toThrow(
      '".QuoteStrip-lastPrice" not found',
    )
  })
})

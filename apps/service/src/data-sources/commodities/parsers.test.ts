import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import {
  parseBtcPriceFromDocument,
  parseGoldPriceFromDocument,
  parseInflationFromDocument,
  parseOilPriceFromDocument,
} from './parseFromDocument'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

const loadDocument = (filename: string): Document => {
  const html = readFileSync(path.join(fixturesDir, filename), 'utf8')
  return parseHTML(html).window.document
}

describe('commodity parsers', () => {
  it('parseInflationFromDocument reads monthly CPI rows and keeps last 12 months', () => {
    expect(parseInflationFromDocument(loadDocument('inflation.html'))).toEqual([
      { datetime: '2024-02-22', value: 100.1 },
      { datetime: '2024-03-22', value: 100.2 },
      { datetime: '2024-04-22', value: 100.3 },
      { datetime: '2024-05-22', value: 100.4 },
      { datetime: '2024-06-22', value: 100.5 },
      { datetime: '2024-07-22', value: 100.6 },
      { datetime: '2024-08-22', value: 100.7 },
      { datetime: '2024-09-22', value: 100.8 },
      { datetime: '2024-10-22', value: 100.9 },
      { datetime: '2024-11-22', value: 101 },
      { datetime: '2024-12-22', value: 101.1 },
    ])
  })

  it('parseInflationFromDocument throws when CPI table is missing', () => {
    expect(() => parseInflationFromDocument(parseHTML('<div></div>').window.document)).toThrow(
      'inflation: no elements matched "tr" in monthly CPI table',
    )
  })

  it('parseGoldPriceFromDocument converts ounce price to grams', () => {
    expect(parseGoldPriceFromDocument(loadDocument('gold.html'))).toEqual({
      g: '99.98',
      oz: '2835',
    })
  })

  it('parseBtcPriceFromDocument reads USD price', () => {
    expect(parseBtcPriceFromDocument(loadDocument('btc.html'))).toEqual({
      usd: '97234.56',
    })
  })

  it('parseOilPriceFromDocument converts barrel price to liters', () => {
    expect(parseOilPriceFromDocument(loadDocument('oil.html'))).toEqual({
      l: '400.00',
    })
  })
})

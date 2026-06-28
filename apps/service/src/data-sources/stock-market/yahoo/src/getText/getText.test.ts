import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { getFinStreamerText } from './getFinStreamerText'
import { getOptionalStatisticText } from './getOptionalStatisticText'
import { getOptionalText } from './getOptionalText'
import { getStatisticText } from './getStatisticText'
import { getText } from './getText'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

const loadDocument = (filename: string): Document => {
  const html = readFileSync(path.join(fixturesDir, filename), 'utf8')
  return parseHTML(html).window.document
}

describe('Yahoo getText helpers', () => {
  it('getText reads textContent', () => {
    const document = loadDocument('text.html')

    expect(getText(document, '#price')).toBe('123.45')
  })

  it('getText reads attribute value', () => {
    const document = loadDocument('text.html')

    expect(getText(document, '#attr', 'data-value')).toBe('99.00')
  })

  it('getText throws when element is missing', () => {
    const document = loadDocument('text.html')

    expect(() => getText(document, '.missing')).toThrow('Element not found: .missing')
  })

  it('getText throws when text content is empty', () => {
    const document = loadDocument('text.html')

    expect(() => getText(document, '.empty')).toThrow('Element has no text content: .empty')
  })

  it('getOptionalText returns text when present', () => {
    const document = loadDocument('text.html')

    expect(getOptionalText(document, '#price')).toBe('123.45')
  })

  it('getOptionalText returns undefined when element is missing', () => {
    const document = loadDocument('text.html')

    expect(getOptionalText(document, '.missing')).toBeUndefined()
  })

  it('getOptionalText returns undefined when text content is empty', () => {
    const document = loadDocument('text.html')

    expect(getOptionalText(document, '.empty')).toBeUndefined()
  })

  it('getStatisticText reads value next to label with title prefix', () => {
    const document = loadDocument('statistics.html')

    expect(getStatisticText(document, 'Previous Close')).toBe('123.45')
  })

  it('getStatisticText throws when statistics section is missing', () => {
    const document = parseHTML('<div></div>').window.document

    expect(() => getStatisticText(document, 'Previous Close')).toThrow('Statistics section not found')
  })

  it('getStatisticText throws when statistic is missing', () => {
    const document = loadDocument('statistics.html')

    expect(() => getStatisticText(document, 'Market Cap')).toThrow('Statistic not found: Market Cap')
  })

  it('getOptionalStatisticText reads value when present', () => {
    const document = loadDocument('statistics.html')

    expect(getOptionalStatisticText(document, 'Earnings Date')).toBe('Jan 25, 2026')
  })

  it('getOptionalStatisticText returns undefined for placeholder value', () => {
    const document = loadDocument('statistics.html')

    expect(getOptionalStatisticText(document, 'Earnings Date (est.)')).toBeUndefined()
  })

  it('getOptionalStatisticText returns undefined when statistic is missing', () => {
    const document = loadDocument('statistics.html')

    expect(getOptionalStatisticText(document, 'Market Cap')).toBeUndefined()
  })

  it('getFinStreamerText reads data-value attribute', () => {
    const document = loadDocument('fin-streamer.html')

    expect(getFinStreamerText(document, 'targetMeanPrice')).toBe('150.00')
  })
})

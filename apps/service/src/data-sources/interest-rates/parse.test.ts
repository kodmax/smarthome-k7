import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { parseNbpRatesFromDocument, parseWiborFromHtml } from './parse'

const fixturesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

const loadHtml = (filename: string): string => readFileSync(path.join(fixturesDir, filename), 'utf8')

const loadDocument = (filename: string): Document => parseHTML(loadHtml(filename)).window.document

describe('interest rate parsers', () => {
  it('parseWiborFromHtml extracts WIBOR rates and date from HTML fragment', () => {
    expect(parseWiborFromHtml(loadHtml('wibor.html'))).toEqual({
      'WIBOR 3M': { ir: '5.75', delta: '0.12', date: '2026-06-28' },
      'WIBOR 6M': { ir: '5.80', delta: '-0.05', date: '2026-06-28' },
    })
  })

  it('parseWiborFromHtml returns empty object when rates are missing', () => {
    expect(parseWiborFromHtml('<div></div>')).toEqual({})
  })

  it('parseNbpRatesFromDocument reads NBP table rows', () => {
    expect(parseNbpRatesFromDocument(loadDocument('nbp.html'))).toEqual({
      'Stopa referencyjna': { ir: '5.75%', date: '2024-10-04' },
      'Stopa lombardowa': { ir: '6.25%', date: '2024-10-04' },
    })
  })
})

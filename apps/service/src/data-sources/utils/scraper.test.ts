import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { requireElements, requireNumber, withScraperSource } from '@/utils/scraper'

describe('scraper', () => {
  it('requireNumber throws with selector when element is missing', () => {
    const document = parseHTML('<div></div>').window.document

    expect(() => requireNumber(document.body, '.price-section__current-value')).toThrow(
      '".price-section__current-value" not found',
    )
  })

  it('requireElements throws with selector and context when no matches', () => {
    const document = parseHTML('<div></div>').window.document

    expect(() => requireElements(document, 'tr', 'monthly CPI table')).toThrow(
      'no elements matched "tr" in monthly CPI table',
    )
  })

  it('withScraperSource prefixes helper errors with source name', () => {
    const document = parseHTML('<div></div>').window.document

    expect(() =>
      withScraperSource('gold', () => requireNumber(document.body, '.price-section__current-value')),
    ).toThrow('gold: ".price-section__current-value" not found')
  })
})

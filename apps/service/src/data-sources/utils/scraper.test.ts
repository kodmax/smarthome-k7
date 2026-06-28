import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { requireElements, requireNumber, requireText, withScraperSource } from '@/utils/scraper'

describe('scraper', () => {
  it('requireNumber returns parsed value', () => {
    const document = parseHTML('<div class="price">1234.56</div>').window.document

    expect(requireNumber(document, '.price')).toBe(1234.56)
  })

  it('requireNumber strips commas before parsing', () => {
    const document = parseHTML('<div class="price">2,834.50</div>').window.document

    expect(requireNumber(document, '.price')).toBe(2834.5)
  })

  it('requireNumber throws with selector when element is missing', () => {
    const document = parseHTML('<div></div>').window.document

    expect(() => requireNumber(document.body, '.price-section__current-value')).toThrow(
      '".price-section__current-value" not found',
    )
  })

  it('requireNumber throws when textContent is empty', () => {
    const document = parseHTML('<div class="price"></div>').window.document

    expect(() => requireNumber(document, '.price')).toThrow('".price" has empty text')
  })

  it('requireNumber throws when textContent is not numeric', () => {
    const document = parseHTML('<div class="price">N/A</div>').window.document

    expect(() => requireNumber(document, '.price')).toThrow('".price" is not numeric (N/A)')
  })

  it('requireElements throws with selector and context when no matches', () => {
    const document = parseHTML('<div></div>').window.document

    expect(() => requireElements(document, 'tr', 'monthly CPI table')).toThrow(
      'no elements matched "tr" in monthly CPI table',
    )
  })

  it('requireText returns trimmed text with comma replaced by dot', () => {
    const document = parseHTML('<div class="row"><span class="value">5,75%</span></div>').window.document

    expect(requireText(document, '.value', 'test context')).toBe('5.75%')
  })

  it('requireText throws when selector is missing', () => {
    const document = parseHTML('<div></div>').window.document

    expect(() => requireText(document, '.value', 'test context')).toThrow('missing ".value" in test context')
  })

  it('requireText throws when textContent is empty', () => {
    const document = parseHTML('<div class="row"><span class="value"></span></div>').window.document

    expect(() => requireText(document, '.value', 'test context')).toThrow('missing ".value" in test context')
  })

  it('withScraperSource prefixes helper errors with source name', () => {
    const document = parseHTML('<div></div>').window.document

    expect(() =>
      withScraperSource('gold', () => requireNumber(document.body, '.price-section__current-value')),
    ).toThrow('gold: ".price-section__current-value" not found')
  })
})

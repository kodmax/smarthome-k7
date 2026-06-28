import { parseHTML } from 'linkedom'
import { describe, expect, it } from 'vitest'
import { getTextContent } from '@/utils/get-text-context'

describe('getTextContent', () => {
  it('returns trimmed text from element', () => {
    const document = parseHTML('<div>  hello  </div>').window.document
    const element = document.querySelector('div') as Element

    expect(getTextContent(element)).toBe('hello')
  })

  it('replaces comma with dot', () => {
    const document = parseHTML('<div>5,75</div>').window.document
    const element = document.querySelector('div') as Element

    expect(getTextContent(element)).toBe('5.75')
  })

  it('reads text from nested selector', () => {
    const document = parseHTML('<div><span class="value">123</span></div>').window.document
    const element = document.querySelector('div') as Element

    expect(getTextContent(element, '.value')).toBe('123')
  })

  it('throws when selector is missing', () => {
    const document = parseHTML('<div></div>').window.document
    const element = document.querySelector('div') as Element

    expect(() => getTextContent(element, '.missing')).toThrow('HTML Node textContent not found')
  })

  it('returns empty string when textContent is empty', () => {
    const document = parseHTML('<div><span class="value"></span></div>').window.document
    const element = document.querySelector('div') as Element

    expect(getTextContent(element, '.value')).toBe('')
  })
})

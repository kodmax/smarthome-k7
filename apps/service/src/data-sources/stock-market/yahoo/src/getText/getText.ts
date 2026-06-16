export const getText = (parent: Document | Element, selector: string, attributeName?: string): string => {
  const el = parent.querySelector(selector)
  if (el === null) {
    throw new Error('Element not found: ' + selector)
  }

  const text = attributeName !== undefined ? el.getAttribute(attributeName) : el.textContent

  if (text === null || text === '') {
    throw new Error('Element has no text content: ' + selector)
  }

  return text.trim()
}

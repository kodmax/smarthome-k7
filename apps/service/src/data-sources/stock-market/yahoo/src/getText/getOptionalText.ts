export const getOptionalText = (
  parent: Document | Element,
  selector: string,
  attributeName?: string,
): string | undefined => {
  const el = parent.querySelector(selector)
  if (el === null) {
    return undefined
  }

  const text = attributeName !== undefined ? el.getAttribute(attributeName) : el.textContent

  if (text === null || text === '') {
    return undefined
  }

  return text.trim()
}

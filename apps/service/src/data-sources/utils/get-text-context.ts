const getTextContent: (element: Element, selector?: string) => string = (element, selector) => {
  const target = selector ? element.querySelector(selector) : element

  if (target && typeof target.textContent === 'string') {
    return target.textContent.replace(',', '.').trim()
  }

  throw new Error('HTML Node textContent not found')
}

export { getTextContent }

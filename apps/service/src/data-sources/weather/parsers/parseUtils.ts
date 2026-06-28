export const requireElements = (root: ParentNode, selector: string, context: string): Element[] => {
  const elements = Array.from(root.querySelectorAll(selector))
  if (elements.length === 0) {
    throw new Error(`no elements matched "${selector}" in ${context}`)
  }

  return elements
}

export const requireText = (element: ParentNode, selector: string, context: string): string => {
  const target = element.querySelector(selector)
  if (target?.textContent === null || target?.textContent === undefined || target.textContent.trim() === '') {
    throw new Error(`missing "${selector}" in ${context}`)
  }

  return target.textContent.replace(',', '.').trim()
}

export const requireDetail = (details: Record<string, string>, key: string, context: string): string => {
  const value = details[key]
  if (value === undefined) {
    throw new Error(`missing detail "${key}" in ${context}`)
  }

  return value
}

export const withScraperSource = <T>(source: string, fn: () => T): T => {
  try {
    return fn()
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`${source}: ${error.message}`, { cause: error })
    }

    throw error
  }
}

export const requireElements = (root: ParentNode, selector: string, context: string): Element[] => {
  const elements = Array.from(root.querySelectorAll(selector))
  if (elements.length === 0) {
    throw new Error(`no elements matched "${selector}" in ${context}`)
  }

  return elements
}

export const requireNumber = (root: ParentNode, selector: string): number => {
  const target = root.querySelector(selector)
  if (!target) {
    throw new Error(`"${selector}" not found`)
  }

  if (typeof target.textContent !== 'string' || target.textContent.trim() === '') {
    throw new Error(`"${selector}" has empty text`)
  }

  const value = Number(target.textContent.replace(/,/g, '').trim())
  if (Number.isNaN(value)) {
    throw new Error(`"${selector}" is not numeric (${target.textContent.trim()})`)
  }

  return value
}

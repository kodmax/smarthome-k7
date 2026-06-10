export const getOptionalStatisticText = (document: Document, title: string): string | null => {
  const container = document.querySelector('[data-testid="quote-statistics"]')
  if (container === null) {
    throw new Error('Statistics section not found')
  }

  const value = container.querySelector(`.label[title="${title}"]`)?.nextElementSibling
  if (value === undefined || value === null) {
    return null
  }

  const text = value.textContent
  if (text === null) {
    throw new Error('Statistic has no text content: ' + title)
  }

  return text.trim()
}

import { requireNumber } from '@/utils/scraper'

const getNumberContent: (element: Element, selector: string) => number = (element, selector) =>
  requireNumber(element, selector)

export { getNumberContent }

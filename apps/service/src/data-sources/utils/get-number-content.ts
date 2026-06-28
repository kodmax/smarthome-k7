import { requireNumber } from '@/utils/scraper'

const getNumberContent: (root: ParentNode, selector: string) => number = (root, selector) =>
  requireNumber(root, selector)

export { getNumberContent }

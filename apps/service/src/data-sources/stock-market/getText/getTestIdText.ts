import { getText } from './getText'

export const getTestIdText = (document: Document, testId: string): string => {
  return getText(document, `[data-testid="${testId}"]`)
}

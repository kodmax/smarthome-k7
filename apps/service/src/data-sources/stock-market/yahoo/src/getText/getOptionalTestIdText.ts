import { getOptionalText } from './getOptionalText'

export const getOptionalTestIdText = (document: Document, testId: string): string | undefined => {
  return getOptionalText(document, `[data-testid="${testId}"]`)
}

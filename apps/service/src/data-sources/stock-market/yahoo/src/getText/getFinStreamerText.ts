import { getText } from './getText'

export const getFinStreamerText = (document: Document, fieldId: string): string => {
  return getText(document, `fin-streamer[data-field="${fieldId}"]`, 'data-value')
}

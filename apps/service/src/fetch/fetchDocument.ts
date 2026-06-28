import { parseHTML } from 'linkedom'
import { fetchText } from './fetchText'

export async function fetchDocument(
  url: string,
  extraHeaders?: Record<string, string>,
  method = 'GET',
): Promise<Document> {
  return parseHTML(await fetchText(url, extraHeaders, method)).window.document
}

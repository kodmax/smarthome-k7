import { fetchText } from './fetchText'
import { parseHtmlDocument } from './parseHtmlDocument'

export async function fetchDocument(
  url: string,
  extraHeaders?: Record<string, string>,
  method = 'GET',
): Promise<Document> {
  return parseHtmlDocument(await fetchText(url, extraHeaders, method))
}

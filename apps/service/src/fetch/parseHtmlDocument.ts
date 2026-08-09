type ParseHTML = (html: string) => { window: { document: Document } }

let parseHTMLPromise: Promise<ParseHTML> | undefined

const getParseHTML = async (): Promise<ParseHTML> => {
  if (parseHTMLPromise === undefined) {
    parseHTMLPromise = import('linkedom').then(({ parseHTML }) => parseHTML as ParseHTML)
  }

  return parseHTMLPromise
}

export async function parseHtmlDocument(html: string): Promise<Document> {
  const parseHTML = await getParseHTML()
  return parseHTML(html).window.document
}

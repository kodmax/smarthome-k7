import { JobAdDocument } from '@repo/types'

export const buildJobAdDedupKey = (companyName: string, title: string): string =>
  `${companyName.toLocaleLowerCase()} -- ${title.toLocaleUpperCase()}`

export function dedupeJobAdDocuments(documents: JobAdDocument[]): JobAdDocument[] {
  const seen = new Set<string>()
  const result: JobAdDocument[] = []

  for (const document of documents) {
    const key = buildJobAdDedupKey(document.content.companyName, document.content.title)
    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(document)
  }

  return result
}

import { createHash } from 'node:crypto'

export const digestJjitId = (slug: string): string => createHash('sha256').update(slug).digest('hex')

export const jjitDedupKey = (companyName: string, title: string): string =>
  `${companyName.toLocaleLowerCase()} -- ${title.toLocaleUpperCase()}`

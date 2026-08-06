import { createHash } from 'node:crypto'

export const digestTheprotocolId = (offerUrlName: string): string =>
  createHash('sha256').update(offerUrlName).digest('hex')

export const theprotocolDedupKey = (companyName: string, title: string): string =>
  `${companyName.toLocaleLowerCase()} -- ${title.toLocaleUpperCase()}`

import { createHash } from 'node:crypto'

export const digestTheprotocolId = (offerUrlName: string): string =>
  createHash('sha256').update(offerUrlName).digest('hex')

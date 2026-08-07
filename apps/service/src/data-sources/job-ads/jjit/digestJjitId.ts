import { createHash } from 'node:crypto'

export const digestJjitId = (slug: string): string => createHash('sha256').update(slug).digest('hex')

import { createHash } from 'node:crypto'

export const digestNfjId = (id: string): string => createHash('sha256').update(id).digest('hex')

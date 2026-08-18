import { createHash } from 'node:crypto'

export const digestWellfoundId = (jobId: string): string =>
  createHash('sha256').update(`wellfound:${jobId}`).digest('hex')

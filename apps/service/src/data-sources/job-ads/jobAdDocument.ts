import { emptyJobAdStoredMeta, JobAd, JobAdApplicationMeta, JobAdDocument } from '@repo/types'
import { z } from 'zod'

const jobAdDocumentSchema = z.object({
  content: z.looseObject({
    id: z.string(),
    title: z.string(),
  }),
  meta: z.looseObject({}),
})

export function createJobAdDocument(content: JobAd): JobAdDocument {
  return {
    content,
    meta: emptyJobAdStoredMeta(content.publishedAt),
  }
}

export function parseJobAdDocument(value: unknown): JobAdDocument | null {
  const result = jobAdDocumentSchema.safeParse(value)
  if (!result.success) {
    return null
  }

  return {
    content: result.data.content as JobAd,
    meta: result.data.meta as JobAdDocument['meta'],
  }
}

export function toStatusChangedAtIso(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString()
  }

  return value
}

export function withApplicationStatusChangedAt(
  application: JobAdApplicationMeta,
  now: Date = new Date(),
): JobAdApplicationMeta {
  return {
    ...application,
    statusChangedAt: application.applyStatus === 'pending-review' ? null : toStatusChangedAtIso(now),
  }
}

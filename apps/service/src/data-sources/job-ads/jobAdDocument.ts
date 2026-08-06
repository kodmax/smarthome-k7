import { emptyJobAdStoredMeta, JobAd, JobAdApplicationMeta, JobAdDocument } from '@repo/types'

export function createJobAdDocument(content: JobAd): JobAdDocument {
  return {
    content,
    meta: emptyJobAdStoredMeta(content.publishedAt),
  }
}

export function parseJobAdDocument(value: unknown): JobAdDocument | null {
  if (value === null || typeof value !== 'object') {
    return null
  }

  const record = value as Record<string, unknown>
  const content = record.content
  const meta = record.meta

  if (content === null || typeof content !== 'object' || meta === null || typeof meta !== 'object') {
    return null
  }

  const contentRecord = content as Record<string, unknown>
  if (typeof contentRecord.id !== 'string' || typeof contentRecord.title !== 'string') {
    return null
  }

  return {
    content: content as JobAd,
    meta: meta as JobAdDocument['meta'],
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

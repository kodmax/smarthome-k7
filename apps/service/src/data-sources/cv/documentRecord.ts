import { createHash } from 'node:crypto'
import { z } from 'zod'
import { captureInvalidInput } from '@/sentry'

export const CV_SCOPE = 'job-market'
export const CV_TEXT_ID = 'cv-text'

export const cvTextContentSchema = z.object({
  text: z.string(),
})

export type CvTextContent = z.infer<typeof cvTextContentSchema>

export type DocumentRecordRow = {
  scope: string
  id: string
  hash: string
  modified_at: Date | string
  content: CvTextContent | string
}

export function digestCvPdfSourceHash(base64: string): string {
  return createHash('sha256').update(Buffer.from(base64, 'base64')).digest('hex')
}

export function digestDocumentContentHash(documentId: string, content: CvTextContent): string {
  switch (documentId) {
    case CV_TEXT_ID:
      return createHash('sha256').update(content.text).digest('hex')
    default:
      throw new Error(`Unsupported document id for content hash: ${documentId}`)
  }
}

export function parseCvTextContent(content: CvTextContent | string): CvTextContent | null {
  let value: unknown = content
  if (typeof content === 'string') {
    try {
      value = JSON.parse(content) as unknown
    } catch (cause) {
      captureInvalidInput('cv: failed to parse cv text content in row', cause)
      return null
    }
  }

  const result = cvTextContentSchema.safeParse(value)
  if (!result.success) {
    captureInvalidInput('cv: invalid cv text content in row', content)
    return null
  }

  return result.data
}

export function toModifiedAtIso(modifiedAt: Date | string): string {
  return modifiedAt instanceof Date ? modifiedAt.toISOString() : modifiedAt
}

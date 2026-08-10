import { createHash } from 'node:crypto'
import { captureInvalidInput } from '@/sentry'

export const CV_SCOPE = 'job-market'
export const CV_TEXT_ID = 'cv-text'

export type CvTextContent = {
  text: string
}

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
  if (typeof content === 'string') {
    try {
      const parsed = JSON.parse(content) as Record<string, unknown>
      if (typeof parsed.text !== 'string') {
        captureInvalidInput('cv: invalid cv text content in row', content)
        return null
      }

      return { text: parsed.text }
    } catch (cause) {
      captureInvalidInput('cv: failed to parse cv text content in row', cause)
      return null
    }
  }

  if (typeof content.text !== 'string') {
    captureInvalidInput('cv: invalid cv text content in row', content)
    return null
  }

  return content
}

export function toModifiedAtIso(modifiedAt: Date | string): string {
  return modifiedAt instanceof Date ? modifiedAt.toISOString() : modifiedAt
}

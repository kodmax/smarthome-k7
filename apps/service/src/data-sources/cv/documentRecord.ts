import { createHash } from 'node:crypto'

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

export type UploadCommandArgs = {
  base64: string
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

export function parseUploadCommandArgs(args: string): UploadCommandArgs | null {
  try {
    const parsed = JSON.parse(args) as Record<string, unknown>
    if (typeof parsed.base64 !== 'string' || parsed.base64.length === 0) {
      return null
    }

    return {
      base64: parsed.base64,
    }
  } catch {
    return null
  }
}

export function parseCvTextContent(content: DocumentRecordRow['content']): CvTextContent | null {
  const parsed = typeof content === 'string' ? (JSON.parse(content) as unknown) : content
  if (typeof parsed !== 'object' || parsed === null || typeof (parsed as CvTextContent).text !== 'string') {
    return null
  }

  return {
    text: (parsed as CvTextContent).text,
  }
}

export function toModifiedAtIso(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString()
}

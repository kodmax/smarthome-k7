import { describe, expect, it } from 'vitest'
import {
  CV_TEXT_ID,
  digestDocumentContentHash,
  parseCvTextContent,
  parseUploadCommandArgs,
  toModifiedAtIso,
} from './documentRecord'

describe('documentRecord', () => {
  it('parses upload command args', () => {
    expect(parseUploadCommandArgs(JSON.stringify({ base64: 'abc123' }))).toEqual({ base64: 'abc123' })
  })

  it('rejects invalid upload command args', () => {
    expect(parseUploadCommandArgs(JSON.stringify({ base64: '' }))).toBeNull()
    expect(parseUploadCommandArgs(JSON.stringify({}))).toBeNull()
    expect(parseUploadCommandArgs('not-json')).toBeNull()
  })

  it('hashes cv-text content from text field', () => {
    const hash = digestDocumentContentHash(CV_TEXT_ID, { text: 'Hello CV' })

    expect(hash).toHaveLength(64)
    expect(hash).toBe(digestDocumentContentHash(CV_TEXT_ID, { text: 'Hello CV' }))
    expect(hash).not.toBe(digestDocumentContentHash(CV_TEXT_ID, { text: 'Other CV' }))
  })

  it('parses cv-text content from object and json string', () => {
    expect(parseCvTextContent({ text: 'CV body' })).toEqual({ text: 'CV body' })
    expect(parseCvTextContent(JSON.stringify({ text: 'CV body' }))).toEqual({ text: 'CV body' })
    expect(parseCvTextContent(JSON.stringify({ filename: 'cv.pdf' }))).toBeNull()
  })

  it('formats modified_at as ISO string', () => {
    expect(toModifiedAtIso(new Date('2026-07-25T08:15:00.000Z'))).toBe('2026-07-25T08:15:00.000Z')
    expect(toModifiedAtIso('2026-07-25T08:15:00.000Z')).toBe('2026-07-25T08:15:00.000Z')
  })
})

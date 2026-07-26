import { beforeEach, describe, expect, it, vi } from 'vitest'
import type OpenAI from 'openai'
import type { Pool } from 'mariadb'
import { registerDependency } from '@/di'
import { CV_SCOPE, CV_TEXT_ID, digestCvPdfSourceHash, digestDocumentContentHash } from './documentRecord'
import { CvSource } from './data-source'

vi.mock('./extractPdfText', () => ({
  extractPdfText: vi.fn(async () => 'Extracted CV text'),
}))

import { extractPdfText } from './extractPdfText'

const pdfBase64 = Buffer.from('pdf bytes').toString('base64')
const sourceHash = digestCvPdfSourceHash(pdfBase64)
const contentHash = digestDocumentContentHash(CV_TEXT_ID, { text: 'Extracted CV text' })

describe('CvSource', () => {
  const query = vi.fn()
  const release = vi.fn()
  const getConnection = vi.fn(async () => ({ query, release }))
  const db = { getConnection } as unknown as Pool
  const openai = {} as OpenAI
  const push = vi.fn()

  beforeEach(() => {
    query.mockReset()
    release.mockReset()
    getConnection.mockClear()
    push.mockReset()
    vi.mocked(extractPdfText).mockClear()
    registerDependency('db', db)
    registerDependency('openai', openai)
  })

  it('returns cv hash from composeContent', async () => {
    query.mockResolvedValueOnce([
      {
        scope: CV_SCOPE,
        id: CV_TEXT_ID,
        hash: contentHash,
        modified_at: '2026-07-25T08:15:00.000Z',
        content: { text: 'Extracted CV text' },
      },
    ])

    const source = new CvSource(push, () => {})
    const feed = await source.composeContent()

    expect(feed).toEqual({
      cv: {
        modifiedAt: '2026-07-25T08:15:00.000Z',
        text: 'Extracted CV text',
        hash: contentHash,
      },
    })
    expect(release).toHaveBeenCalledOnce()
  })

  it('skips extraction and touches modified_at when source_hash matches existing cv-text', async () => {
    query.mockResolvedValueOnce([{ source_hash: sourceHash }]).mockResolvedValueOnce(undefined)

    const source = new CvSource(push, () => {})
    await source.handleCommand('upload', JSON.stringify({ base64: pdfBase64 }))

    expect(extractPdfText).not.toHaveBeenCalled()
    expect(query).toHaveBeenNthCalledWith(2, expect.stringContaining('update documents'), [CV_SCOPE, CV_TEXT_ID])
    expect(push).toHaveBeenCalledOnce()
    expect(release).toHaveBeenCalledTimes(2)
  })

  it('does not push when upload args are invalid', async () => {
    const source = new CvSource(push, () => {})
    await source.handleCommand('upload', JSON.stringify({ base64: '' }))

    expect(extractPdfText).not.toHaveBeenCalled()
    expect(query).not.toHaveBeenCalled()
    expect(push).not.toHaveBeenCalled()
  })

  it('extracts and upserts cv-text when source_hash differs', async () => {
    query
      .mockResolvedValueOnce([{ source_hash: 'old-source-hash' }])
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(undefined)

    const source = new CvSource(push, () => {})
    await source.handleCommand('upload', JSON.stringify({ base64: pdfBase64 }))

    expect(extractPdfText).toHaveBeenCalledWith(openai, pdfBase64)
    expect(query).toHaveBeenNthCalledWith(2, expect.stringContaining('insert into documents'), [
      CV_SCOPE,
      CV_TEXT_ID,
      contentHash,
      sourceHash,
      JSON.stringify({ text: 'Extracted CV text' }),
    ])
    expect(query).toHaveBeenNthCalledWith(3, expect.stringContaining('update documents'), [CV_SCOPE, CV_TEXT_ID])
    expect(push).toHaveBeenCalledOnce()
    expect(release).toHaveBeenCalledTimes(3)
  })
})

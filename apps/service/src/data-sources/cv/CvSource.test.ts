import { mkdtempSync, rmSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import type OpenAI from 'openai'
import { FeedEvents, FSCache } from '@repo/feeds'
import { createSilentLogger } from '@repo/logger'
import { registerDependency } from '@/di'
import { mockSql } from '@/test/mockSql'
import { CV_SCOPE, CV_TEXT_ID, digestCvPdfSourceHash, digestDocumentContentHash } from './documentRecord'
import { CvSource } from './CvSource'

vi.mock('./extractPdfText', () => ({
  extractPdfText: vi.fn(async () => 'Extracted CV text'),
}))

import { extractPdfText } from './extractPdfText'

const pdfBase64 = Buffer.from('pdf bytes').toString('base64')
const sourceHash = digestCvPdfSourceHash(pdfBase64)
const contentHash = digestDocumentContentHash(CV_TEXT_ID, { text: 'Extracted CV text' })

const noopOnError = (): void => void 0

describe('CvSource', () => {
  let db = mockSql()
  const openai = {} as OpenAI
  let feedEvents: FeedEvents
  let emitSpy: ReturnType<typeof vi.spyOn>
  const cacheDirs: string[] = []

  afterEach(() => {
    for (const dir of cacheDirs.splice(0)) {
      rmSync(dir, { recursive: true, force: true })
    }
  })

  async function createCvSource() {
    const cacheDir = mkdtempSync(join(tmpdir(), 'cv-source-'))
    cacheDirs.push(cacheDir)

    const cache = new FSCache(cacheDir)
    const cacheEntry = await cache.getEntry(CvSource.getId(), { ttlMs: CvSource.getCacheTTL() })

    return new CvSource({
      feedEvents,
      cacheEntry,
      logger: createSilentLogger(),
      onError: noopOnError,
    })
  }

  beforeEach(() => {
    db = mockSql()
    vi.mocked(extractPdfText).mockClear()
    feedEvents = new FeedEvents()
    emitSpy = vi.spyOn(feedEvents, 'emit')
    registerDependency('db', db)
    registerDependency('openai', openai)
  })

  it('returns cv hash from getData', async () => {
    db = mockSql([
      {
        scope: CV_SCOPE,
        id: CV_TEXT_ID,
        hash: contentHash,
        modified_at: '2026-07-25T08:15:00.000Z',
        content: { text: 'Extracted CV text' },
      },
    ])
    registerDependency('db', db)

    const source = await createCvSource()
    const feed = await source.getData()

    expect(feed).toEqual({
      cv: {
        modifiedAt: '2026-07-25T08:15:00.000Z',
        text: 'Extracted CV text',
        hash: contentHash,
      },
    })
    expect(db).toHaveBeenCalledOnce()
  })

  it('skips extraction and touches modified_at when source_hash matches existing cv-text', async () => {
    db = mockSql([{ source_hash: sourceHash }], [])
    registerDependency('db', db)

    const source = await createCvSource()
    await source.upload({ base64: pdfBase64 })

    expect(extractPdfText).not.toHaveBeenCalled()
    expect(db).toHaveBeenCalledTimes(2)
    expect(emitSpy).toHaveBeenCalledWith('data-update', 'cv')
  })

  it('extracts and upserts cv-text when source_hash differs', async () => {
    db = mockSql([{ source_hash: 'old-source-hash' }], [], [])
    registerDependency('db', db)

    const source = await createCvSource()
    await source.upload({ base64: pdfBase64 })

    expect(extractPdfText).toHaveBeenCalledWith(openai, pdfBase64)
    expect(db).toHaveBeenCalledTimes(3)
    expect(emitSpy).toHaveBeenCalledWith('data-update', 'cv')
  })
})

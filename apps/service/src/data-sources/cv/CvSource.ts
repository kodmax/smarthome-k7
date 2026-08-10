import { CacheAgeUnit, DataSource } from '@repo/feeds'
import { type CvCachedFeed, type CvFeed, type CvUploadPayload } from '@repo/types'
import type OpenAI from 'openai'
import type { Sql } from '@repo/db'
import { Inject } from '@/di'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import {
  CV_SCOPE,
  CV_TEXT_ID,
  digestCvPdfSourceHash,
  digestDocumentContentHash,
  parseCvTextContent,
  toModifiedAtIso,
  type CvTextContent,
  type DocumentRecordRow,
} from './documentRecord'
import { extractPdfText } from './extractPdfText'

export class CvSource extends DataSource<CvFeed, CvCachedFeed> {
  @Inject('db')
  declare private db: Sql

  @Inject('openai')
  declare private openai: OpenAI

  public async upload(input: CvUploadPayload): Promise<void> {
    if (!(await this.uploadPdf(input))) {
      return
    }

    await this.touchCvTextModifiedAt()
    void this.push()
  }

  static getId() {
    return 'cv'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 4
  }

  protected getSourceMetricType() {
    return 'db' as const
  }

  protected async fetchData(): Promise<CvCachedFeed> {
    return {}
  }

  protected async composeContent(): Promise<CvFeed> {
    return this.loadCvFromDb()
  }

  private async loadCvFromDb(): Promise<CvFeed> {
    const rows = await observeDbQuery(
      'select',
      'documents',
      () =>
        this.db<DocumentRecordRow[]>`
        select scope, id, hash, modified_at, content
        from documents
        where scope = ${CV_SCOPE} and id = ${CV_TEXT_ID}
      `,
    )

    const row = rows[0]
    if (row === undefined) {
      return { cv: null }
    }

    const content = parseCvTextContent(row.content)
    if (content === null) {
      return { cv: null }
    }

    return {
      cv: {
        modifiedAt: toModifiedAtIso(row.modified_at),
        text: content.text,
        hash: row.hash,
      },
    }
  }

  private async loadCvTextSourceHash(): Promise<string | null> {
    const rows = await observeDbQuery(
      'select',
      'documents',
      () =>
        this.db<{ source_hash: string | null }[]>`
        select source_hash
        from documents
        where scope = ${CV_SCOPE} and id = ${CV_TEXT_ID}
      `,
    )

    return rows[0]?.source_hash ?? null
  }

  private async uploadPdf(input: CvUploadPayload): Promise<boolean> {
    const sourceHash = digestCvPdfSourceHash(input.base64)
    const existingSourceHash = await this.loadCvTextSourceHash()
    if (existingSourceHash === sourceHash) {
      return true
    }

    const text = await extractPdfText(this.openai, input.base64)
    const content: CvTextContent = { text }
    const hash = digestDocumentContentHash(CV_TEXT_ID, content)

    await this.upsertCvText(content, hash, sourceHash)
    return true
  }

  private async touchCvTextModifiedAt(): Promise<void> {
    await observeDbQuery(
      'update',
      'documents',
      () =>
        this.db`
        update documents
        set modified_at = now()
        where scope = ${CV_SCOPE} and id = ${CV_TEXT_ID}
      `,
    )
  }

  private async upsertCvText(content: CvTextContent, hash: string, sourceHash: string): Promise<void> {
    await observeDbQuery(
      'insert',
      'documents',
      () =>
        this.db`
        insert into documents (scope, id, hash, source_hash, content)
        values (${CV_SCOPE}, ${CV_TEXT_ID}, ${hash}, ${sourceHash}, ${this.db.json(content)})
        on conflict (scope, id) do update set
          hash = excluded.hash,
          source_hash = excluded.source_hash,
          content = excluded.content,
          modified_at = now()
      `,
    )
  }
}

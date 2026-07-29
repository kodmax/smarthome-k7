import { CacheAgeUnit, DataSourceDefinition } from '@repo/apollo-ws'
import { type CvCachedFeed, type CvFeed } from '@repo/types'
import type OpenAI from 'openai'
import type { Pool } from 'mariadb'
import { Inject } from '@/di'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import {
  CV_SCOPE,
  CV_TEXT_ID,
  digestCvPdfSourceHash,
  digestDocumentContentHash,
  parseCvTextContent,
  parseUploadCommandArgs,
  toModifiedAtIso,
  type CvTextContent,
  type DocumentRecordRow,
} from './documentRecord'
import { extractPdfText } from './extractPdfText'

export class CvSource extends DataSourceDefinition<CvFeed, CvCachedFeed> {
  @Inject('db')
  declare private db: Pool

  @Inject('openai')
  declare private openai: OpenAI

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'upload':
        if (await this.commandUpload(args)) {
          await this.touchCvTextModifiedAt()
          this.push()
        }
        break
    }
  }

  getId() {
    return 'cv'
  }

  getCacheTTL() {
    return CacheAgeUnit.HOUR * 4
  }

  async getData(): Promise<CvCachedFeed> {
    return {}
  }

  async composeContent(): Promise<CvFeed> {
    return this.loadCvFromDb()
  }

  private async loadCvFromDb(): Promise<CvFeed> {
    const conn = await this.db.getConnection()
    try {
      const rows = (await observeDbQuery('select', 'documents', () =>
        conn.query(
          `select scope, id, hash, modified_at, content
         from documents
         where scope = ? and id = ?`,
          [CV_SCOPE, CV_TEXT_ID],
        ),
      )) as DocumentRecordRow[]

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
    } finally {
      conn.release()
    }
  }

  private async loadCvTextSourceHash(): Promise<string | null> {
    const conn = await this.db.getConnection()
    try {
      const rows = (await observeDbQuery('select', 'documents', () =>
        conn.query(
          `select source_hash
         from documents
         where scope = ? and id = ?`,
          [CV_SCOPE, CV_TEXT_ID],
        ),
      )) as { source_hash: string | null }[]

      return rows[0]?.source_hash ?? null
    } finally {
      conn.release()
    }
  }

  private async commandUpload(args: string): Promise<boolean> {
    const parsed = parseUploadCommandArgs(args)
    if (parsed === null) {
      return false
    }

    const sourceHash = digestCvPdfSourceHash(parsed.base64)
    const existingSourceHash = await this.loadCvTextSourceHash()
    if (existingSourceHash === sourceHash) {
      return true
    }

    const text = await extractPdfText(this.openai, parsed.base64)
    const content: CvTextContent = { text }
    const hash = digestDocumentContentHash(CV_TEXT_ID, content)

    await this.upsertCvText(content, hash, sourceHash)
    return true
  }

  private async touchCvTextModifiedAt(): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await observeDbQuery('update', 'documents', () =>
        conn.query(
          `update documents
         set modified_at = current_timestamp()
         where scope = ? and id = ?`,
          [CV_SCOPE, CV_TEXT_ID],
        ),
      )
    } finally {
      conn.release()
    }
  }

  private async upsertCvText(content: CvTextContent, hash: string, sourceHash: string): Promise<void> {
    const conn = await this.db.getConnection()
    try {
      await observeDbQuery('insert', 'documents', () =>
        conn.query(
          `insert into documents (scope, id, hash, source_hash, content)
         values (?, ?, ?, ?, ?)
         on duplicate key update
           hash = values(hash),
           source_hash = values(source_hash),
           content = values(content),
           modified_at = current_timestamp()`,
          [CV_SCOPE, CV_TEXT_ID, hash, sourceHash, JSON.stringify(content)],
        ),
      )
    } finally {
      conn.release()
    }
  }
}

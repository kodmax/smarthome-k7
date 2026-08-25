import { createHash } from 'node:crypto'
import type { JobAdMatchAnalysis } from '@repo/types'
import type { Sql } from '@repo/db'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { CV_SCOPE, CV_TEXT_ID, cvTextContentSchema } from '../cv/documentRecord'
import { cvMatchContentSchema } from './cvMatchSchema'

export const CV_MATCH_SCOPE = 'cv-match'

export type CvMatchContent = {
  analyzedAt: string
  score: number
  summary: string
  strengths: string
  gaps: string
  mustHaveGaps?: string[]
  observations: string
  conclusion: string
}

export type LoadedCvMatch = {
  analysis: JobAdMatchAnalysis
  analyzedCvTextHash: string | null
}

type DocumentRow = {
  id: string
  source_hash: string | null
  content: CvMatchContent | string
  modified_at: Date | string
}

export function digestCvMatchContentHash(content: CvMatchContent): string {
  return createHash('sha256').update(JSON.stringify(content)).digest('hex')
}

export function parseCvMatchContent(content: DocumentRow['content']): CvMatchContent | null {
  const parsed = typeof content === 'string' ? (JSON.parse(content) as unknown) : content
  const result = cvMatchContentSchema.safeParse(parsed)
  if (!result.success) {
    return null
  }

  return result.data
}

export function cvMatchContentToMatchAnalysis(content: CvMatchContent): JobAdMatchAnalysis {
  return {
    analyzedAt: content.analyzedAt,
    score: content.score,
    summary: content.summary,
    strengths: content.strengths,
    gaps: content.gaps,
    ...(content.mustHaveGaps !== undefined ? { mustHaveGaps: content.mustHaveGaps } : {}),
    observations: content.observations,
    conclusion: content.conclusion,
  }
}

export async function saveCvMatch(db: Sql, adId: string, content: CvMatchContent, cvTextHash: string): Promise<void> {
  const hash = digestCvMatchContentHash(content)

  await observeDbQuery(
    'insert',
    'documents',
    () =>
      db`
      insert into documents (scope, id, hash, source_hash, content)
      values (${CV_MATCH_SCOPE}, ${adId}, ${hash}, ${cvTextHash}, ${db.json(content)})
      on conflict (scope, id) do update set
        hash = excluded.hash,
        source_hash = excluded.source_hash,
        content = excluded.content,
        modified_at = now()
    `,
  )
}

export async function loadCvMatchesByAdIds(db: Sql, adIds: string[]): Promise<Map<string, LoadedCvMatch>> {
  if (adIds.length === 0) {
    return new Map()
  }

  const rows = await observeDbQuery(
    'select',
    'documents',
    () =>
      db<DocumentRow[]>`
      select id, source_hash, content, modified_at
      from documents
      where scope = ${CV_MATCH_SCOPE}
        and id in ${db(adIds)}
    `,
  )

  const result = new Map<string, LoadedCvMatch>()
  for (const row of rows) {
    const content = parseCvMatchContent(row.content)
    if (content === null) {
      continue
    }

    result.set(row.id, {
      analysis: cvMatchContentToMatchAnalysis(content),
      analyzedCvTextHash: row.source_hash,
    })
  }

  return result
}

export type LoadedCV = {
  text: string | null
  hash: string | null
}

export async function loadCV(db: Sql): Promise<LoadedCV | null> {
  const rows = await observeDbQuery(
    'select',
    'documents',
    () =>
      db<Array<{ hash: string; content: unknown }>>`
      select hash, content
      from documents
      where scope = ${CV_SCOPE} and id = ${CV_TEXT_ID}
    `,
  )

  const row = rows[0]
  if (row === undefined) {
    return null
  }

  const parsed = typeof row.content === 'string' ? JSON.parse(row.content) : row.content
  const content = cvTextContentSchema.safeParse(parsed)

  return {
    text: content.success ? content.data.text : null,
    hash: row.hash,
  }
}

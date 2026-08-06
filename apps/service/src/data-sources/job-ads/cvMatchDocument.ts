import { createHash } from 'node:crypto'
import type { JobAdMatchAnalysis } from '@repo/types'
import type { Sql } from '@repo/db'
import { observeDbQuery } from '@/prometheus/dbMetrics'
import { CV_SCOPE, CV_TEXT_ID } from '../cv/documentRecord'

export const CV_MATCH_SCOPE = 'cv-match'

export type CvMatchContent = {
  analyzedAt: string
  score: number
  summary: string
  strengths: string
  gaps: string
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

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

export function digestCvMatchContentHash(content: CvMatchContent): string {
  return createHash('sha256').update(JSON.stringify(content)).digest('hex')
}

export function parseCvMatchContent(content: DocumentRow['content']): CvMatchContent | null {
  const parsed = typeof content === 'string' ? (JSON.parse(content) as unknown) : content
  if (
    typeof parsed !== 'object' ||
    parsed === null ||
    typeof (parsed as { analyzedAt?: unknown }).analyzedAt !== 'string'
  ) {
    return null
  }

  const record = parsed as Record<string, unknown>
  if (
    typeof record.score !== 'number' ||
    !Number.isInteger(record.score) ||
    record.score < 0 ||
    record.score > 100 ||
    !isNonEmptyString(record.summary) ||
    !isNonEmptyString(record.strengths) ||
    !isNonEmptyString(record.gaps) ||
    !isNonEmptyString(record.observations) ||
    !isNonEmptyString(record.conclusion)
  ) {
    return null
  }

  return {
    analyzedAt: record.analyzedAt as string,
    score: record.score,
    summary: record.summary.trim(),
    strengths: record.strengths.trim(),
    gaps: record.gaps.trim(),
    observations: record.observations.trim(),
    conclusion: record.conclusion.trim(),
  }
}

export function cvMatchContentToMatchAnalysis(content: CvMatchContent): JobAdMatchAnalysis {
  return {
    analyzedAt: content.analyzedAt,
    score: content.score,
    summary: content.summary,
    strengths: content.strengths,
    gaps: content.gaps,
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
  const text =
    typeof parsed === 'object' && parsed !== null && typeof (parsed as { text?: unknown }).text === 'string'
      ? (parsed as { text: string }).text
      : null

  return {
    text,
    hash: row.hash,
  }
}

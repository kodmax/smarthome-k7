import { createHash } from 'node:crypto'
import type { JobAdMatchAnalysis } from '@repo/types'
import type { Pool } from 'mariadb'

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

type DocumentRow = {
  id: string
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

export async function saveCvMatch(db: Pool, adId: string, content: CvMatchContent): Promise<void> {
  const hash = digestCvMatchContentHash(content)

  await db.query(
    `insert into documents (scope, id, hash, content)
     values (?, ?, ?, ?)
     on duplicate key update
       hash = values(hash),
       content = values(content),
       modified_at = current_timestamp()`,
    [CV_MATCH_SCOPE, adId, hash, JSON.stringify(content)],
  )
}

export async function loadCvMatchesByAdIds(db: Pool, adIds: string[]): Promise<Map<string, JobAdMatchAnalysis>> {
  if (adIds.length === 0) {
    return new Map()
  }

  const conn = await db.getConnection()
  try {
    const rows = (await conn.query(
      `select id, content, modified_at
       from documents
       where scope = ?
         and id in (?)`,
      [CV_MATCH_SCOPE, adIds],
    )) as DocumentRow[]

    const result = new Map<string, JobAdMatchAnalysis>()
    for (const row of rows) {
      const content = parseCvMatchContent(row.content)
      if (content === null) {
        continue
      }

      result.set(row.id, cvMatchContentToMatchAnalysis(content))
    }

    return result
  } finally {
    conn.release()
  }
}

export async function loadCvText(db: Pool): Promise<string | null> {
  const conn = await db.getConnection()
  try {
    const rows = (await conn.query(
      `select content
       from documents
       where scope = ? and id = ?`,
      ['job-market', 'cv-text'],
    )) as Array<{ content: unknown }>

    const row = rows[0]
    if (row === undefined) {
      return null
    }

    const parsed = typeof row.content === 'string' ? JSON.parse(row.content) : row.content
    if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { text?: unknown }).text !== 'string') {
      return null
    }

    return (parsed as { text: string }).text
  } finally {
    conn.release()
  }
}

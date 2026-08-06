import { observeDbQuery } from '@/prometheus/dbMetrics'
import { JobAdApplicationMeta, JobAdDocument } from '@repo/types'
import type { Pool } from 'mariadb'
import { CV_MATCH_SCOPE } from './cvMatchDocument'
import {
  createJobAdDocument,
  parseJobAdDocument,
  toStatusChangedAtIso,
  withApplicationStatusChangedAt,
} from './jobAdDocument'

export const JOB_ADS_RETENTION_DAYS = 90

type JobAdRow = {
  id: string
  data: unknown
}

export async function loadExistingJobAdIds(db: Pool, ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) {
    return new Set()
  }

  const rows = (await observeDbQuery('select', 'job_ads', () =>
    db.query('select id from job_ads where id in (?)', [ids]),
  )) as Array<{ id: string }>

  return new Set(rows.map(row => row.id))
}

export async function batchUpdateLastSeen(db: Pool, ids: string[]): Promise<void> {
  if (ids.length === 0) {
    return
  }

  await observeDbQuery('update', 'job_ads', () =>
    db.query('update job_ads set last_seen = current_timestamp() where id in (?)', [ids]),
  )
}

export async function batchInsertJobAds(
  db: Pool,
  documents: Array<{ id: string; document: JobAdDocument }>,
): Promise<void> {
  if (documents.length === 0) {
    return
  }

  await observeDbQuery('insert', 'job_ads', () =>
    db.batch(
      `insert into job_ads (id, data)
       values (?, ?)`,
      documents.map(({ id, document }) => [id, document]),
    ),
  )
}

export async function loadJobAdsByIds(db: Pool, ids: string[]): Promise<Map<string, JobAdDocument>> {
  if (ids.length === 0) {
    return new Map()
  }

  const rows = (await observeDbQuery('select', 'job_ads', () =>
    db.query('select id, data from job_ads where id in (?)', [ids]),
  )) as JobAdRow[]

  const byId = new Map<string, JobAdDocument>()
  for (const row of rows) {
    const parsed = parseJobAdDocument(row.data)
    if (parsed !== null) {
      byId.set(row.id, parsed)
    }
  }

  return byId
}

export async function loadJobAdDocument(db: Pool, id: string): Promise<JobAdDocument | null> {
  const documents = await loadJobAdsByIds(db, [id])
  return documents.get(id) ?? null
}

export async function loadJobAdAdvertUrl(db: Pool, id: string): Promise<string | null> {
  const document = await loadJobAdDocument(db, id)
  const advertUrl = document?.content.advertUrl
  return advertUrl !== undefined && advertUrl.length > 0 ? advertUrl : null
}

export async function updateJobAdApplicationMeta(
  db: Pool,
  id: string,
  application: JobAdApplicationMeta,
): Promise<void> {
  const document = await loadJobAdDocument(db, id)
  if (document === null) {
    return
  }

  const applicationWithTimestamp = withApplicationStatusChangedAt(application)
  const applicationJson = JSON.stringify(applicationWithTimestamp)
  await observeDbQuery('update', 'job_ads', () =>
    db.query(
      `update job_ads
       set data = json_set(data, '$.meta.application', cast(? as json))
       where id = ?`,
      [applicationJson, id],
    ),
  )
}

export async function updateJobAdFav(db: Pool, id: string, fav: boolean): Promise<void> {
  const document = await loadJobAdDocument(db, id)
  if (document === null) {
    const stub = createJobAdDocument({
      id,
      title: '',
      advertUrl: '',
      companyLogoUrl: '',
      companyName: '',
      requiredSkills: [],
      workplaceType: 'office',
      employmentType: 'b2b',
      origin: 'jj',
      publishedAt: new Date(0).toISOString(),
    })
    stub.meta.fav = fav

    await observeDbQuery('insert', 'job_ads', () =>
      db.query('insert into job_ads (id, data) values (?, ?)', [id, stub]),
    )
    return
  }

  await observeDbQuery('update', 'job_ads', () =>
    db.query(`update job_ads set data = json_set(data, '$.meta.fav', ?) where id = ?`, [fav, id]),
  )
}

export async function deleteStaleJobAds(db: Pool, retentionDays: number): Promise<number> {
  const result = await observeDbQuery('delete', 'job_ads', () =>
    db.query('delete from job_ads where last_seen < current_timestamp() - interval ? day', [retentionDays]),
  )

  return (result as { affectedRows?: number }).affectedRows ?? 0
}

export async function deleteOrphanCvMatches(db: Pool): Promise<number> {
  const result = await observeDbQuery('delete', 'documents', () =>
    db.query(
      `delete d from documents d
       left join job_ads j on j.id = d.id
       where d.scope = ?
         and j.id is null`,
      [CV_MATCH_SCOPE],
    ),
  )

  return (result as { affectedRows?: number }).affectedRows ?? 0
}

export async function markStaleAppliedAsArchivedNoResponse(db: Pool, cutoffIso: string): Promise<boolean> {
  const statusChangedAt = toStatusChangedAtIso(new Date())
  const result = await observeDbQuery('update', 'job_ads', () =>
    db.query(
      `update job_ads
       set data = json_set(
         data,
         '$.meta.application.applyStatus', 'archived',
         '$.meta.application.archiveReason', 'no-response',
         '$.meta.application.comment', null,
         '$.meta.application.statusChangedAt', ?
       )
       where json_unquote(json_extract(data, '$.meta.application.applyStatus')) = 'applied'
         and json_extract(data, '$.meta.application.appliedAt') is not null
         and json_unquote(json_extract(data, '$.meta.application.appliedAt')) <= ?`,
      [statusChangedAt, cutoffIso],
    ),
  )

  return ((result as { affectedRows?: number }).affectedRows ?? 0) > 0
}

export async function loadJobAdApplicationMeta(db: Pool, id: string): Promise<JobAdApplicationMeta | null> {
  const document = await loadJobAdDocument(db, id)
  return document?.meta.application ?? null
}

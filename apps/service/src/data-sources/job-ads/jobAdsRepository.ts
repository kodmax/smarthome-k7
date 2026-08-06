import { observeDbQuery } from '@/prometheus/dbMetrics'
import { JobAdApplicationMeta, JobAdDocument } from '@repo/types'
import type { Pool } from 'mariadb'
import { CV_MATCH_SCOPE } from './cvMatchDocument'
import { isManualJobAdDocument } from './manual/applyManualJobAdContentUpdate'
import {
  createJobAdDocument,
  parseJobAdDocument,
  toStatusChangedAtIso,
  withApplicationStatusChangedAt,
} from './jobAdDocument'

export const JOB_ADS_RETENTION_DAYS = 90
export const MANUAL_DELETE_WINDOW_HOURS = 24

export { isManualJobAdDocument } from './manual/applyManualJobAdContentUpdate'

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

  const applicationJson = JSON.stringify(withApplicationStatusChangedAt(application))
  await observeDbQuery('update', 'job_ads', () =>
    db.query(
      `update job_ads
       set data = json_set(data, '$.meta.application', json_extract(?, '$'))
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

export async function insertManualJobAd(db: Pool, document: JobAdDocument): Promise<boolean> {
  const existingIds = await loadExistingJobAdIds(db, [document.content.id])
  if (existingIds.has(document.content.id)) {
    return false
  }

  await observeDbQuery('insert', 'job_ads', () =>
    db.query(
      'insert into job_ads (id, added_at, last_seen, data) values (?, current_timestamp(), current_timestamp(), ?)',
      [document.content.id, document],
    ),
  )

  return true
}

export async function loadManualJobAdIds(db: Pool): Promise<string[]> {
  const rows = (await observeDbQuery('select', 'job_ads', () =>
    db.query(
      `select id
       from job_ads
       where json_unquote(json_extract(data, '$.content.origin')) = 'manual'`,
    ),
  )) as Array<{ id: string }>

  return rows.map(row => row.id)
}

export async function loadJobAdsAddedAtByIds(db: Pool, ids: string[]): Promise<Map<string, string>> {
  if (ids.length === 0) {
    return new Map()
  }

  const rows = (await observeDbQuery('select', 'job_ads', () =>
    db.query('select id, added_at from job_ads where id in (?)', [ids]),
  )) as Array<{ id: string; added_at: Date | string }>

  const byId = new Map<string, string>()
  for (const row of rows) {
    const addedAt = row.added_at instanceof Date ? row.added_at.toISOString() : new Date(row.added_at).toISOString()
    byId.set(row.id, addedAt)
  }

  return byId
}

export async function updateManualJobAd(db: Pool, document: JobAdDocument): Promise<boolean> {
  if (!isManualJobAdDocument(document)) {
    return false
  }

  const existing = await loadJobAdDocument(db, document.content.id)
  if (existing === null || !isManualJobAdDocument(existing)) {
    return false
  }

  await observeDbQuery('update', 'job_ads', () =>
    db.query('update job_ads set data = ? where id = ?', [document, document.content.id]),
  )

  return true
}

export async function deleteManualJobAd(db: Pool, id: string): Promise<boolean> {
  const document = await loadJobAdDocument(db, id)
  if (document === null || !isManualJobAdDocument(document)) {
    return false
  }

  const result = await observeDbQuery('delete', 'job_ads', () =>
    db.query(
      `delete from job_ads
       where id = ?
         and json_unquote(json_extract(data, '$.content.origin')) = 'manual'
         and added_at >= current_timestamp() - interval ? hour`,
      [id, MANUAL_DELETE_WINDOW_HOURS],
    ),
  )

  const deleted = ((result as { affectedRows?: number }).affectedRows ?? 0) > 0
  if (!deleted) {
    return false
  }

  await observeDbQuery('delete', 'documents', () =>
    db.query('delete from documents where scope = ? and id = ?', [CV_MATCH_SCOPE, id]),
  )

  return true
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

import { observeDbQuery } from '@/prometheus/dbMetrics'
import { JobAdApplicationMeta, JobAdDocument } from '@repo/types'
import type { Sql } from '@repo/db'
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

export async function loadExistingJobAdIds(db: Sql, ids: string[]): Promise<Set<string>> {
  if (ids.length === 0) {
    return new Set()
  }

  const rows = await observeDbQuery(
    'select',
    'job_ads',
    () => db<Array<{ id: string }>>`select id from job_ads where id in ${db(ids)}`,
  )

  return new Set(rows.map(row => row.id))
}

export async function batchUpdateLastSeen(db: Sql, ids: string[]): Promise<void> {
  if (ids.length === 0) {
    return
  }

  await observeDbQuery('update', 'job_ads', () => db`update job_ads set last_seen = now() where id in ${db(ids)}`)
}

export async function batchInsertJobAds(
  db: Sql,
  documents: Array<{ id: string; document: JobAdDocument }>,
): Promise<void> {
  if (documents.length === 0) {
    return
  }

  await observeDbQuery(
    'insert',
    'job_ads',
    () => db`insert into job_ads ${db(documents.map(({ id, document }) => ({ id, data: document })))}`,
  )
}

export async function loadJobAdsByIds(db: Sql, ids: string[]): Promise<Map<string, JobAdDocument>> {
  if (ids.length === 0) {
    return new Map()
  }

  const rows = await observeDbQuery(
    'select',
    'job_ads',
    () => db<JobAdRow[]>`select id, data from job_ads where id in ${db(ids)}`,
  )

  const byId = new Map<string, JobAdDocument>()
  for (const row of rows) {
    const parsed = parseJobAdDocument(row.data)
    if (parsed !== null) {
      byId.set(row.id, parsed)
    }
  }

  return byId
}

export async function loadJobAdDocument(db: Sql, id: string): Promise<JobAdDocument | null> {
  const documents = await loadJobAdsByIds(db, [id])
  return documents.get(id) ?? null
}

export async function loadJobAdAdvertUrl(db: Sql, id: string): Promise<string | null> {
  const document = await loadJobAdDocument(db, id)
  const advertUrl = document?.content.advertUrl
  return advertUrl !== undefined && advertUrl.length > 0 ? advertUrl : null
}

export async function updateJobAdApplicationMeta(
  db: Sql,
  id: string,
  application: JobAdApplicationMeta,
): Promise<void> {
  const document = await loadJobAdDocument(db, id)
  if (document === null) {
    return
  }

  const applicationJson = withApplicationStatusChangedAt(application)
  await observeDbQuery(
    'update',
    'job_ads',
    () =>
      db`
      update job_ads
      set data = jsonb_set(data, '{meta,application}', ${db.json(applicationJson)})
      where id = ${id}
    `,
  )
}

export async function updateJobAdFav(db: Sql, id: string, fav: boolean): Promise<void> {
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

    await observeDbQuery('insert', 'job_ads', () => db`insert into job_ads (id, data) values (${id}, ${db.json(stub)})`)
    return
  }

  await observeDbQuery(
    'update',
    'job_ads',
    () => db`update job_ads set data = jsonb_set(data, '{meta,fav}', ${db.json(fav)}) where id = ${id}`,
  )
}

export async function insertManualJobAd(db: Sql, document: JobAdDocument): Promise<boolean> {
  const existingIds = await loadExistingJobAdIds(db, [document.content.id])
  if (existingIds.has(document.content.id)) {
    return false
  }

  await observeDbQuery(
    'insert',
    'job_ads',
    () =>
      db`
      insert into job_ads (id, added_at, last_seen, data)
      values (${document.content.id}, now(), now(), ${db.json(document)})
    `,
  )

  return true
}

export async function loadManualJobAdIds(db: Sql): Promise<string[]> {
  const rows = await observeDbQuery(
    'select',
    'job_ads',
    () =>
      db<Array<{ id: string }>>`
      select id
      from job_ads
      where data->'content'->>'origin' = 'manual'
    `,
  )

  return rows.map(row => row.id)
}

export async function loadJobAdsAddedAtByIds(db: Sql, ids: string[]): Promise<Map<string, string>> {
  if (ids.length === 0) {
    return new Map()
  }

  const rows = await observeDbQuery(
    'select',
    'job_ads',
    () =>
      db<Array<{ id: string; added_at: Date | string }>>`
      select id, added_at from job_ads where id in ${db(ids)}
    `,
  )

  const byId = new Map<string, string>()
  for (const row of rows) {
    const addedAt = row.added_at instanceof Date ? row.added_at.toISOString() : new Date(row.added_at).toISOString()
    byId.set(row.id, addedAt)
  }

  return byId
}

export async function updateJobAdDetails(db: Sql, document: JobAdDocument): Promise<boolean> {
  const existing = await loadJobAdDocument(db, document.content.id)
  if (existing === null) {
    return false
  }

  await observeDbQuery(
    'update',
    'job_ads',
    () => db`update job_ads set data = ${db.json(document)} where id = ${document.content.id}`,
  )

  return true
}

export async function deleteManualJobAd(db: Sql, id: string): Promise<boolean> {
  const document = await loadJobAdDocument(db, id)
  if (document === null || !isManualJobAdDocument(document)) {
    return false
  }

  const result = await observeDbQuery(
    'delete',
    'job_ads',
    () =>
      db`
      delete from job_ads
      where id = ${id}
        and data->'content'->>'origin' = 'manual'
        and added_at >= now() - ${`${MANUAL_DELETE_WINDOW_HOURS} hours`}::interval
    `,
  )

  if ((result.count ?? 0) === 0) {
    return false
  }

  await observeDbQuery(
    'delete',
    'documents',
    () => db`delete from documents where scope = ${CV_MATCH_SCOPE} and id = ${id}`,
  )

  return true
}

export async function deleteStaleJobAds(db: Sql, retentionDays: number): Promise<number> {
  const result = await observeDbQuery(
    'delete',
    'job_ads',
    () =>
      db`
      delete from job_ads
      where last_seen < now() - ${`${retentionDays} days`}::interval
    `,
  )

  return result.count ?? 0
}

export async function deleteOrphanCvMatches(db: Sql): Promise<number> {
  const result = await observeDbQuery(
    'delete',
    'documents',
    () =>
      db`
      delete from documents d
      where d.scope = ${CV_MATCH_SCOPE}
        and not exists (select 1 from job_ads j where j.id = d.id)
    `,
  )

  return result.count ?? 0
}

export async function markStaleAppliedAsArchivedNoResponse(db: Sql, cutoffIso: string): Promise<boolean> {
  const statusChangedAt = toStatusChangedAtIso(new Date())
  const result = await observeDbQuery(
    'update',
    'job_ads',
    () =>
      db`
      update job_ads
      set data = jsonb_set(
        jsonb_set(
          jsonb_set(
            jsonb_set(
              data,
              '{meta,application,applyStatus}',
              ${db.json('archived')}
            ),
            '{meta,application,archiveReason}',
            ${db.json('no-response')}
          ),
          '{meta,application,comment}',
          'null'::jsonb
        ),
        '{meta,application,statusChangedAt}',
        ${db.json(statusChangedAt)}
      )
      where data->'meta'->'application'->>'applyStatus' = 'applied'
        and data->'meta'->'application'->>'appliedAt' is not null
        and data->'meta'->'application'->>'appliedAt' <= ${cutoffIso}
    `,
  )

  return (result.count ?? 0) > 0
}

export async function loadJobAdApplicationMeta(db: Sql, id: string): Promise<JobAdApplicationMeta | null> {
  const document = await loadJobAdDocument(db, id)
  return document?.meta.application ?? null
}

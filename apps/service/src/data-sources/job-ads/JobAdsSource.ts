import { CacheAgeUnit, DataSource } from '@repo/feeds'
import { Inject } from '@/di'
import type { Pool } from 'mariadb'
import type OpenAI from 'openai'
import {
  JobAdDocument,
  JobAdsCachedFeed,
  JobAdsFeed,
  JobAdsFeedItem,
  emptyJobAdMeta,
  jobAdApplicationFromMeta,
} from '@repo/types'
import { filterJobAdsByAcceptableSalary, dedupeJobAdDocuments } from './filters'
import { computeJobAdsSalaryRange } from './computeJobAdsSalaryRange'
import { loadAcceptableSalary, parseSetAcceptableSalaryCommandArgs, saveAcceptableSalary } from './jobAdsPreferences'
import {
  applyStatusChange,
  emptyApplicationMeta,
  parseChangeStateCommandArgs,
  resolveStatusChangedAt,
  type ChangeApplyStatusInput,
  type ChangeStateCommandArgs,
} from './applicationMeta'
import { runAnalyzeCvMatchCommand } from './analyzeCvMatchCommand'
import { loadCvMatchesByAdIds, loadCV } from './cvMatchDocument'
import {
  JOB_ADS_RETENTION_DAYS,
  deleteOrphanCvMatches,
  deleteStaleJobAds,
  insertManualJobAd,
  deleteManualJobAd as deleteManualJobAdFromDb,
  loadJobAdAdvertUrl,
  loadJobAdApplicationMeta,
  loadJobAdsAddedAtByIds,
  loadJobAdsByIds,
  loadJobAdDocument,
  loadManualJobAdIds,
  markStaleAppliedAsArchivedNoResponse,
  updateJobAdApplicationMeta,
  updateJobAdFav,
  updateManualJobAd,
} from './jobAdsRepository'
import { applyManualJobAdContentUpdate } from './manual/applyManualJobAdContentUpdate'
import { buildManualJobAdDocument, parseAddManualJobAdArgs } from './manual/parseAddManualJobAdArgs'
import {
  parseDeleteManualJobAdArgs,
  parseEditManualJobAdArgs,
  type EditManualJobAdCommandArgs,
} from './manual/parseEditManualJobAdArgs'
import { syncJobAdsFromSources } from './syncJobAdsFromSources'

const STALE_APPLIED_ARCHIVE_AFTER_DAYS = 7

export class JobAdsSource extends DataSource<JobAdsFeed, JobAdsCachedFeed> {
  @Inject('db')
  declare private db: Pool

  @Inject('openai')
  declare private openai: OpenAI

  public async handleCommand(command: string, args: string): Promise<void> {
    switch (command) {
      case 'change-state': {
        const parsed = parseChangeStateCommandArgs(args)
        if (parsed !== null) {
          await this.changeState(parsed)
        }
        break
      }
      case 'fav':
        await this.fav(args)
        break
      case 'unfav':
        await this.unfav(args)
        break
      case 'set-acceptable-salary': {
        const parsed = parseSetAcceptableSalaryCommandArgs(args)
        if (parsed !== null) {
          await this.setAcceptableSalary(parsed.value)
        }
        break
      }
      case 'analyze-cv-match':
        await this.analyzeCvMatch(args.trim())
        break
      case 'add-manual': {
        const parsed = parseAddManualJobAdArgs(args)
        if (parsed !== null) {
          await this.addManualJobAd(parsed)
        }
        break
      }
      case 'edit-manual': {
        const parsed = parseEditManualJobAdArgs(args)
        if (parsed !== null) {
          await this.editManualJobAd(parsed)
        }
        break
      }
      case 'delete-manual': {
        const parsed = parseDeleteManualJobAdArgs(args)
        if (parsed !== null) {
          await this.deleteManualJobAd(parsed)
        }
        break
      }
      default:
        return
    }

    await this.push()
  }

  public async setAcceptableSalary(value: number): Promise<void> {
    await saveAcceptableSalary(this.db, value)
  }

  public async changeState(input: ChangeStateCommandArgs): Promise<void> {
    await this.saveApplicationChange(input.id, {
      applyStatus: input.applyStatus,
      archiveReason: input.archiveReason,
      comment: input.comment,
    })
  }

  private async saveApplicationChange(itemId: string, input: ChangeApplyStatusInput): Promise<void> {
    const current = (await loadJobAdApplicationMeta(this.db, itemId)) ?? emptyApplicationMeta()
    const next = applyStatusChange(current, input)
    if (next === null) {
      return
    }

    await updateJobAdApplicationMeta(this.db, itemId, next)
  }

  public async fav(itemId: string): Promise<void> {
    await updateJobAdFav(this.db, itemId.trim(), true)
  }

  public async unfav(itemId: string): Promise<void> {
    await updateJobAdFav(this.db, itemId.trim(), false)
  }

  public async analyzeCvMatch(adId: string): Promise<void> {
    await runAnalyzeCvMatchCommand({
      db: this.db,
      openai: this.openai,
      adId,
      loadAdUrl: itemId => loadJobAdAdvertUrl(this.db, itemId),
    })
  }

  public async addManualJobAd(input: Parameters<typeof buildManualJobAdDocument>[0]): Promise<void> {
    const document = buildManualJobAdDocument(input)
    await insertManualJobAd(this.db, document)
  }

  public async editManualJobAd(input: EditManualJobAdCommandArgs): Promise<void> {
    const existing = await loadJobAdDocument(this.db, input.id)
    if (existing === null) {
      return
    }

    const updated = applyManualJobAdContentUpdate(existing, input)
    await updateManualJobAd(this.db, updated)
  }

  public async deleteManualJobAd(id: string): Promise<void> {
    await deleteManualJobAdFromDb(this.db, id)
  }

  static getId() {
    return 'job-ads'
  }

  static getCron() {
    return '0 * * * *'
  }

  static getCacheTTL() {
    return CacheAgeUnit.HOUR * 4
  }

  protected getSourceMetricType() {
    return 'api' as const
  }

  protected async fetchData(): Promise<JobAdsCachedFeed> {
    return syncJobAdsFromSources(this.db)
  }

  protected async composeContent(cached: JobAdsCachedFeed): Promise<JobAdsFeed> {
    const manualIds = await loadManualJobAdIds(this.db)
    const listingIdSet = new Set(cached.listingIds)
    const allListingIds = [...cached.listingIds, ...manualIds.filter(id => !listingIdSet.has(id))]
    const documentsById = await loadJobAdsByIds(this.db, allListingIds)
    const documents = dedupeJobAdDocuments(
      allListingIds.flatMap(id => {
        const document = documentsById.get(id)
        return document !== undefined ? [document] : []
      }),
    ).sort(
      (a, b) => (b.content.monthlySalaryRangeAfterTaxes?.to ?? 0) - (a.content.monthlySalaryRangeAfterTaxes?.to ?? 0),
    )

    const salaryRange = computeJobAdsSalaryRange(documents.map(document => document.content))
    const acceptableSalary = await loadAcceptableSalary(this.db)
    const ads = await this.toFeedItems(documents)

    return {
      ads: filterJobAdsByAcceptableSalary(ads, acceptableSalary),
      salaryRange,
      acceptableSalary,
    }
  }

  public async maintenance() {
    await deleteStaleJobAds(this.db, JOB_ADS_RETENTION_DAYS)
    await deleteOrphanCvMatches(this.db)

    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - STALE_APPLIED_ARCHIVE_AFTER_DAYS)

    const appliedArchived = await markStaleAppliedAsArchivedNoResponse(this.db, cutoff.toISOString())
    if (appliedArchived) {
      void this.push()
    }
  }

  private async toFeedItems(documents: JobAdDocument[]): Promise<JobAdsFeedItem[]> {
    if (documents.length === 0) {
      return []
    }

    const ids = documents.map(document => document.content.id)
    const manualIds = documents
      .filter(document => document.content.origin === 'manual')
      .map(document => document.content.id)
    const addedAtById = await loadJobAdsAddedAtByIds(this.db, manualIds)
    const currentCV = await loadCV(this.db)
    const currentCvTextHash = currentCV?.hash ?? null
    const matchAnalysisById = await loadCvMatchesByAdIds(this.db, ids)

    return documents.map(document => {
      const { content, meta } = document
      const loadedMatchAnalysis = matchAnalysisById.get(content.id)

      const isCurrentCVUsed =
        loadedMatchAnalysis !== undefined &&
        loadedMatchAnalysis.analyzedCvTextHash !== null &&
        currentCvTextHash !== null &&
        loadedMatchAnalysis.analyzedCvTextHash === currentCvTextHash

      return {
        content: {
          ...content,
          publishedAt: meta.firstPublishedAt,
        },
        matchAnalysis: loadedMatchAnalysis?.analysis ?? null,
        meta: {
          ...emptyJobAdMeta(),
          application: jobAdApplicationFromMeta({
            ...meta.application,
            statusChangedAt: resolveStatusChangedAt(
              meta.application.applyStatus,
              meta.application.statusChangedAt ?? undefined,
            ),
          }),
          fav: meta.fav,
          isCurrentCVUsed,
          addedAt: content.origin === 'manual' ? (addedAtById.get(content.id) ?? null) : null,
        },
      }
    })
  }
}

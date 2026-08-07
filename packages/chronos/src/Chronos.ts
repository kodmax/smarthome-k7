import type { Logger } from '@repo/logger'
import { TICK_INTERVAL_MS, TICK_LEAD_MS } from './constants'
import { cronJobId } from './cronJobId'
import { parseCronWhen } from './parseCronWhen'
import { getMissedScheduledTimes, truncateToMinute } from './scheduledTimes'
import { ChronosOptions, CronExecutionStore, Job, JobSpec, JobState, MisfirePolicy } from './types'

const requiresExecutionStore = (misfirePolicy: MisfirePolicy | undefined): boolean =>
  misfirePolicy !== undefined && misfirePolicy !== 'skip'

const shouldRecordSuccess = (
  job: Job,
  executionStore: CronExecutionStore | undefined,
): executionStore is CronExecutionStore =>
  executionStore !== undefined && requiresExecutionStore(job.policy?.misfirePolicy)

export class Chronos {
  private jobs: Job[] = []
  private tickTimeout: NodeJS.Timeout | undefined
  private stopped = false
  private readonly logger?: Logger
  private readonly executionStore?: CronExecutionStore

  public constructor(options: ChronosOptions = {}) {
    this.logger = options.logger
    this.executionStore = options.executionStore
    this.next()
  }

  private next(): void {
    if (this.stopped) {
      return
    }

    /**
     * Not more often than once a minute. Each tick is adjusted to hit the start of the next minute
     */
    this.tickTimeout = setTimeout(
      () => this.tick(new Date()),
      TICK_LEAD_MS + TICK_INTERVAL_MS - (new Date().getTime() % TICK_INTERVAL_MS),
    )
  }

  private tick(now: Date): void {
    if (this.stopped) {
      return
    }

    const scheduledAt = truncateToMinute(now)

    for (const job of this.jobs) {
      const mm = now.getMonth() + 1
      const nn = now.getMinutes()
      const hh = now.getHours()
      const dm = now.getDate()
      const dw = now.getDay()

      if (
        job.when[0].includes(nn) &&
        job.when[1].includes(hh) &&
        job.when[2].includes(dm) &&
        job.when[3].includes(mm) &&
        job.when[4].includes(dw)
      ) {
        void this.executeJob(job, scheduledAt)
      }
    }

    this.next()
  }

  private scheduleRetry(job: Job, scheduledAt: Date, attempt: number): void {
    const delaySec = job.policy?.retry?.delaySec
    if (delaySec === undefined) {
      return
    }

    job.retryTimeout = setTimeout(() => {
      job.retryTimeout = undefined
      void this.executeJob(job, scheduledAt, attempt + 1)
    }, delaySec * 1000)
  }

  private async executeJob(job: Job, scheduledAt: Date, attempt = 1): Promise<void> {
    const concurrency = job.policy?.concurrencyPolicy ?? 'forbid'

    if (concurrency === 'forbid' && job.state === JobState.RUNNING) {
      this.logger?.warn({ jobId: job.jobId }, 'Crontab job still running, skipping execution')
      return
    }

    if (concurrency === 'replace' && job.state === JobState.RUNNING) {
      job.runGeneration++
    }

    const generation = job.runGeneration
    job.activeRuns++
    job.state = JobState.RUNNING

    this.logger?.info({ jobId: job.jobId, attempt }, 'Crontab job starting')
    const start = Date.now()

    try {
      await job.script()

      if (generation !== job.runGeneration) {
        return
      }

      job.state = JobState.IDLE
      this.logger?.info({ jobId: job.jobId, attempt, durationMs: Date.now() - start }, 'Crontab job completed')

      if (shouldRecordSuccess(job, this.executionStore)) {
        await this.executionStore.recordSuccessfulOccurrence(job.namespace, job.id, scheduledAt)
      }
    } catch (e) {
      if (generation !== job.runGeneration) {
        return
      }

      const maxAttempts = job.policy?.retry?.maxAttempts
      const canRetry = maxAttempts !== undefined && attempt < maxAttempts

      if (canRetry) {
        job.state = JobState.IDLE
        this.logger?.warn(
          { err: e, jobId: job.jobId, attempt, durationMs: Date.now() - start },
          'Crontab job failed, scheduling retry',
        )
        this.scheduleRetry(job, scheduledAt, attempt)
        return
      }

      job.state = JobState.ERROR
      this.logger?.error({ err: e, jobId: job.jobId, attempt, durationMs: Date.now() - start }, 'Crontab job failed')
    } finally {
      job.activeRuns = Math.max(0, job.activeRuns - 1)
      if (job.activeRuns === 0 && job.state === JobState.RUNNING) {
        job.state = JobState.IDLE
      }
    }
  }

  public addJob(spec: JobSpec): void {
    const jobId = cronJobId(spec.namespace, spec.id)

    if (requiresExecutionStore(spec.policy?.misfirePolicy) && this.executionStore === undefined) {
      throw new Error(`Job ${jobId} requires executionStore for misfirePolicy "${spec.policy?.misfirePolicy}"`)
    }

    this.jobs.push({
      namespace: spec.namespace,
      id: spec.id,
      jobId,
      cron: spec.cron,
      when: parseCronWhen(spec.cron),
      state: JobState.IDLE,
      script: spec.script,
      policy: spec.policy,
      runGeneration: 0,
      activeRuns: 0,
      retryTimeout: undefined,
    })
  }

  public async runMisfireRecovery(now: Date = new Date()): Promise<void> {
    for (const job of this.jobs) {
      const misfirePolicy = job.policy?.misfirePolicy
      if (!requiresExecutionStore(misfirePolicy)) {
        continue
      }

      if (this.executionStore === undefined) {
        throw new Error(`Job ${job.jobId} requires executionStore for misfire recovery`)
      }

      const last = await this.executionStore.getLastSuccessfulOccurrence(job.namespace, job.id)
      const pending = getMissedScheduledTimes(job.when, last, now)

      if (pending.length === 0) {
        continue
      }

      const slots = misfirePolicy === 'run-all' ? pending : [pending[pending.length - 1]]

      for (const scheduledAt of slots) {
        await this.executeJob(job, scheduledAt)
      }
    }
  }

  public stop(): void {
    if (this.stopped) {
      return
    }

    this.stopped = true

    if (this.tickTimeout !== undefined) {
      clearTimeout(this.tickTimeout)
      this.tickTimeout = undefined
    }

    for (const job of this.jobs) {
      if (job.retryTimeout !== undefined) {
        clearTimeout(job.retryTimeout)
        job.retryTimeout = undefined
      }
    }

    this.logger?.info('Chronos stopped')
  }
}

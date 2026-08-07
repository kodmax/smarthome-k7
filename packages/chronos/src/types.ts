import type { Logger } from '@repo/logger'

export type Worker = () => Promise<void>

export enum JobState {
  RUNNING,
  ERROR,
  IDLE,
}

export type MisfirePolicy = 'skip' | 'run-latest' | 'run-all'

export type ConcurrencyPolicy = 'allow' | 'forbid' | 'replace'

export type CronJobPolicy = {
  retry?: { maxAttempts: number; delaySec: number }
  misfirePolicy?: MisfirePolicy
  concurrencyPolicy?: ConcurrencyPolicy
}

export type JobSpec = {
  namespace: string
  id: string
  cron: string
  script: Worker
  policy?: CronJobPolicy
}

export type CronExecutionStore = {
  getLastSuccessfulOccurrence(namespace: string, jobId: string): Promise<Date | undefined>
  recordSuccessfulOccurrence(namespace: string, jobId: string, occurrence: Date): Promise<void>
}

export type ChronosOptions = {
  logger?: Logger
  executionStore?: CronExecutionStore
}

export type Job = {
  namespace: string
  id: string
  jobId: string
  cron: string
  when: number[][]
  state: JobState
  script: Worker
  policy?: CronJobPolicy
  runGeneration: number
  activeRuns: number
  retryTimeout: NodeJS.Timeout | undefined
}

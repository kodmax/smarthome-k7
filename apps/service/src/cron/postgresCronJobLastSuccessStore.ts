import type { CronExecutionStore } from '@repo/chronos'
import type { Sql } from '@repo/db'
import { observeDbQuery } from '@/prometheus/dbMetrics'

type LastSuccessRow = {
  last_successful_occurrence: Date
}

export class PostgresCronJobLastSuccessStore implements CronExecutionStore {
  constructor(private readonly db: Sql) {}

  async getLastSuccessfulOccurrence(namespace: string, jobId: string): Promise<Date | undefined> {
    const rows = await observeDbQuery(
      'select',
      'cron_job_last_success',
      () =>
        this.db<LastSuccessRow[]>`
        select last_successful_occurrence
        from cron_job_last_success
        where namespace = ${namespace}
          and job_id = ${jobId}
      `,
    )

    return rows[0]?.last_successful_occurrence
  }

  async recordSuccessfulOccurrence(namespace: string, jobId: string, occurrence: Date): Promise<void> {
    await observeDbQuery(
      'insert',
      'cron_job_last_success',
      () =>
        this.db`
        insert into cron_job_last_success (namespace, job_id, last_successful_occurrence)
        values (${namespace}, ${jobId}, ${occurrence})
        on conflict (namespace, job_id)
        do update set last_successful_occurrence = excluded.last_successful_occurrence
      `,
    )
  }
}

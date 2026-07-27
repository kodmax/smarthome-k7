import type { Logger } from '@repo/logger'
import {
  CRON_DAY_OF_MONTH,
  CRON_DAY_OF_WEEK,
  CRON_HOUR,
  CRON_MINUTE,
  CRON_MONTH,
  CronDayOfWeek,
  CronMonth,
  TICK_INTERVAL_MS,
  TICK_LEAD_MS,
} from './constants'
import { decode } from './decode'
import { Job, JobState, Worker } from './types'

export class Chronos {
  private jobs: Job[] = []
  private tickTimeout: NodeJS.Timeout | undefined
  private stopped = false

  public constructor(private readonly logger?: Logger) {
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
    const mm = now.getMonth() + 1
    const nn = now.getMinutes()
    const hh = now.getHours()
    const dm = now.getDate()
    const dw = now.getDay()

    for (const job of this.jobs) {
      if (
        job.when[0].includes(nn) &&
        job.when[1].includes(hh) &&
        job.when[2].includes(dm) &&
        job.when[3].includes(mm) &&
        job.when[4].includes(dw)
      ) {
        if (job.state === JobState.RUNNING) {
          this.logger?.warn(`Crontab job <${job.id}> still running, skiping execution`)
        } else {
          this.logger?.info(`Crontab job <${job.id}> starting`)
          job.state = JobState.RUNNING

          job
            .script()
            .then(() => {
              job.state = JobState.IDLE
              this.logger?.info(`Crontab job <${job.id}> completed successfully`)
            })
            .catch(e => {
              job.state = JobState.ERROR
              this.logger?.error(`Crontab job <${job.id}> error: ${e}`)
            })
        }
      }
    }

    this.next()
  }

  public addJob(when: string, id: string, script: Worker) {
    const [nn, hh, dm, mm, dw] = when.split(/\s/)

    this.jobs.push({
      when: [
        decode(nn, CRON_MINUTE.min, CRON_MINUTE.max),
        decode(hh, CRON_HOUR.min, CRON_HOUR.max),
        decode(dm, CRON_DAY_OF_MONTH.min, CRON_DAY_OF_MONTH.max),
        decode(mm, CRON_MONTH.min, CRON_MONTH.max, CronMonth),
        decode(dw, CRON_DAY_OF_WEEK.min, CRON_DAY_OF_WEEK.max, CronDayOfWeek),
      ],
      state: JobState.IDLE,
      script,
      id,
    })
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
  }
}

import { ApolloEvents } from '../ApolloEvents'
import { CronDayOfWeek, CronMonth, decode } from './decode'

export type Worker = () => Promise<void>

enum JobState {
  RUNNING,
  ERROR,
  IDLE,
}

type Job = {
  when: number[][]
  state: JobState
  script: Worker
  id: string
}

export class Chronos {
  private jobs: Job[] = []
  private tickTimeout: NodeJS.Timeout | undefined
  private stopped = false

  public constructor(private readonly vent?: ApolloEvents) {
    this.next()
  }

  private next(): void {
    if (this.stopped) {
      return
    }

    const interval = 60000

    /**
     * Not more often than once a minute. Each tick is adjusted to hit the start of the next minute
     */
    this.tickTimeout = setTimeout(() => this.tick(new Date()), 5000 + interval - (new Date().getTime() % interval))
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
          this.vent?.emit('sys-log', 3, `Crontab job <${job.id}> still running, skiping execution`)
        } else {
          this.vent?.emit('sys-log', 4, `Crontab job <${job.id}> starting`)
          job.state = JobState.RUNNING

          job
            .script()
            .then(() => {
              job.state = JobState.IDLE
              this.vent?.emit('sys-log', 4, `Crontab job <${job.id}> completed successfully`)
            })
            .catch(e => {
              job.state = JobState.ERROR
              this.vent?.emit('sys-log', 3, `Crontab job <${job.id}> error: ${e}`)
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
        decode(nn, 0, 59),
        decode(hh, 0, 23),
        decode(dm, 1, 31),
        decode(mm, 1, 12, CronMonth),
        decode(dw, 0, 6, CronDayOfWeek),
      ],
      state: JobState.IDLE,
      script,
      id,
    })
  }

  public stop(): void {
    this.stopped = true

    if (this.tickTimeout !== undefined) {
      clearTimeout(this.tickTimeout)
      this.tickTimeout = undefined
    }
  }
}

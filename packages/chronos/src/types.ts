export type Worker = () => Promise<void>

export type ChronosLogger = (priority: number, msg: string) => void

export enum JobState {
  RUNNING,
  ERROR,
  IDLE,
}

export type Job = {
  when: number[][]
  state: JobState
  script: Worker
  id: string
}

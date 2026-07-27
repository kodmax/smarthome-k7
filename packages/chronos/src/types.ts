export type Worker = () => Promise<void>

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

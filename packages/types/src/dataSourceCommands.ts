import type { JobAdArchiveReason, JobApplyStatus } from './jobApplyStatusFlow'
import type { WorkplaceType } from './feed'
import type { SkillExperienceLevel } from './skillExperienceLevel'

export type ManualEmploymentType = 'permanent' | 'b2b'

export type JobAdsChangeStatePayload = {
  id: string
  applyStatus: JobApplyStatus
  archiveReason?: JobAdArchiveReason
  comment?: string
}

export type JobAdsSetAcceptableSalaryPayload = {
  value: number
}

export type JobAdsDeleteManualPayload = {
  id: string
}

export type JobAdsAddManualPayload = {
  title: string
  companyName: string
  advertUrl: string
  workplaceType: WorkplaceType
  employmentType: ManualEmploymentType
  salaryFrom?: number
  salaryTo?: number
  applyStatus: JobApplyStatus
  appliedAt?: string
  requiredSkills: string[]
  paidVacationDays?: number
}

export type JobAdsEditManualPayload = {
  id: string
  workplaceType: WorkplaceType
  employmentType: ManualEmploymentType
  salaryFrom?: number
  salaryTo?: number
  requiredSkills: string[]
  paidVacationDays?: number
}

export type MySkillsSetSkillLevelPayload = {
  id: string
  name: string
  level: SkillExperienceLevel
}

export type MySkillsSetSkillCommentPayload = {
  id: string
  comment: string
}

export type CvUploadPayload = {
  base64: string
}

export type LightsSetPayload = {
  circuitId: string
  state: 'on' | 'off'
}

export type CommandPayloadRegistry = {
  'job-ads': {
    'change-state': JobAdsChangeStatePayload
    fav: string
    unfav: string
    'set-acceptable-salary': JobAdsSetAcceptableSalaryPayload
    'analyze-cv-match': string
    'add-manual': JobAdsAddManualPayload
    'edit-manual': JobAdsEditManualPayload
    'delete-manual': JobAdsDeleteManualPayload
  }
  news: {
    read: string
    unread: string
  }
  'my-skills': {
    'set-skill-level': MySkillsSetSkillLevelPayload
    'set-skill-comment': MySkillsSetSkillCommentPayload
  }
  cv: {
    upload: CvUploadPayload
  }
  torrents: {
    search: string
  }
  transmission: {
    download: string
  }
  'energy.meter': {
    reset: void
    start: void
    stop: void
    'request-readings': void
  }
  'sentry-test': {
    throw: void
  }
  lights: {
    set: LightsSetPayload
  }
}

export type CommandPayload<
  S extends keyof CommandPayloadRegistry,
  N extends keyof CommandPayloadRegistry[S],
> = CommandPayloadRegistry[S][N]

export type CommandSourceId = keyof CommandPayloadRegistry

export type CommandName<S extends CommandSourceId> = keyof CommandPayloadRegistry[S] & string

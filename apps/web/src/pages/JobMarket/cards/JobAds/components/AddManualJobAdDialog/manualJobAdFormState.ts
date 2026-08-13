import { JobApplyStatus, WorkplaceType } from '@repo/types'

export const MANUAL_APPLY_STATUSES = [
  'pending-review',
  'consider',
  'applied',
  'interview',
] as const satisfies readonly JobApplyStatus[]

export type ManualApplyStatus = (typeof MANUAL_APPLY_STATUSES)[number]

export type ManualJobAdFormState = {
  title: string
  companyName: string
  advertUrl: string
  workplaceType: WorkplaceType
  employmentType: 'permanent' | 'b2b'
  salaryFrom: string
  salaryTo: string
  applyStatus: ManualApplyStatus
  appliedAt: string
  requiredSkills: string[]
  paidVacationDays: string
}

export const initialAddFormState: ManualJobAdFormState = {
  title: '',
  companyName: '',
  advertUrl: '',
  workplaceType: 'remote',
  employmentType: 'permanent',
  salaryFrom: '',
  salaryTo: '',
  applyStatus: 'pending-review',
  appliedAt: '',
  requiredSkills: [],
  paidVacationDays: '',
}

export function formatSalaryInput(value: number | undefined): string {
  return value === undefined ? '' : String(value)
}

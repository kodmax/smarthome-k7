import type {
  JobAdsAddManualPayload,
  JobAdsEditManualPayload,
  JobAdArchiveReason,
  JobAdsChangeStatePayload,
  JobAdsDeleteManualPayload,
  JobAdsSetAcceptableSalaryPayload,
  JobApplyStatus,
  WorkplaceType,
} from '@repo/types'
import {
  IsArray,
  IsDefined,
  IsEmpty,
  IsIn,
  IsInt,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
  ValidateIf,
} from 'class-validator'

const JOB_APPLY_STATUSES = [
  'pending-review',
  'consider',
  'applied',
  'interview',
  'archived',
] as const satisfies readonly JobApplyStatus[]

const MANUAL_JOB_APPLY_STATUSES = [
  'pending-review',
  'consider',
  'applied',
  'interview',
] as const satisfies readonly JobApplyStatus[]

const JOB_AD_ARCHIVE_REASONS = [
  'other',
  'company-excluded',
  'unmet-requirements',
  'stack-mismatch',
  'weak-match',
  'manager-track',
  'no-response',
  'rejected',
  'withdrawn',
  'offer-accepted',
] as const satisfies readonly JobAdArchiveReason[]

const WORKPLACE_TYPES = ['office', 'remote', 'hybrid'] as const satisfies readonly WorkplaceType[]

const MANUAL_EMPLOYMENT_TYPES = ['permanent', 'b2b'] as const

const MAX_PAID_VACATION_DAYS = 50

export class ItemIdDto {
  @IsString()
  @IsNotEmpty()
  itemId!: string
}

export class ChangeStateDto implements JobAdsChangeStatePayload {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsIn(JOB_APPLY_STATUSES)
  applyStatus!: JobApplyStatus

  @ValidateIf((dto: ChangeStateDto) => dto.applyStatus === 'archived')
  @IsDefined()
  @IsIn(JOB_AD_ARCHIVE_REASONS)
  @ValidateIf((dto: ChangeStateDto) => dto.applyStatus !== 'archived')
  @IsEmpty()
  archiveReason?: JobAdArchiveReason

  @IsOptional()
  @IsString()
  comment?: string
}

export class SetAcceptableSalaryDto implements JobAdsSetAcceptableSalaryPayload {
  @IsNumber()
  @IsPositive()
  value!: number
}

export class AnalyzeCvMatchDto {
  @IsString()
  @IsNotEmpty()
  adId!: string
}

export class AddManualJobAdDto implements JobAdsAddManualPayload {
  @IsString()
  @IsNotEmpty()
  title!: string

  @IsString()
  @IsNotEmpty()
  companyName!: string

  @IsUrl({ require_protocol: true, protocols: ['https'] })
  advertUrl!: string

  @IsIn(WORKPLACE_TYPES)
  workplaceType!: WorkplaceType

  @IsIn(MANUAL_EMPLOYMENT_TYPES)
  employmentType!: 'permanent' | 'b2b'

  @IsOptional()
  @IsNumber()
  @IsPositive()
  salaryFrom?: number

  @IsOptional()
  @IsNumber()
  @IsPositive()
  salaryTo?: number

  @IsIn(MANUAL_JOB_APPLY_STATUSES)
  applyStatus!: JobApplyStatus

  @IsOptional()
  @IsISO8601()
  appliedAt?: string

  @IsArray()
  @IsString({ each: true })
  requiredSkills!: string[]

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_PAID_VACATION_DAYS)
  paidVacationDays?: number
}

export class EditManualJobAdDto implements JobAdsEditManualPayload {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsIn(WORKPLACE_TYPES)
  workplaceType!: WorkplaceType

  @IsIn(MANUAL_EMPLOYMENT_TYPES)
  employmentType!: 'permanent' | 'b2b'

  @IsOptional()
  @IsNumber()
  @IsPositive()
  salaryFrom?: number

  @IsOptional()
  @IsNumber()
  @IsPositive()
  salaryTo?: number

  @IsArray()
  @IsString({ each: true })
  requiredSkills!: string[]

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(MAX_PAID_VACATION_DAYS)
  paidVacationDays?: number
}

export class DeleteManualJobAdDto implements JobAdsDeleteManualPayload {
  @IsString()
  @IsNotEmpty()
  id!: string
}

import {
  SKILL_EXPERIENCE_LEVEL_ORDER,
  type MySkillsSetSkillCommentPayload,
  type MySkillsSetSkillLevelPayload,
  type SkillExperienceLevel,
} from '@repo/types'
import { IsIn, IsNotEmpty, IsString } from 'class-validator'

export class SetSkillLevelDto implements MySkillsSetSkillLevelPayload {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsString()
  @IsNotEmpty()
  name!: string

  @IsIn(SKILL_EXPERIENCE_LEVEL_ORDER)
  level!: SkillExperienceLevel
}

export class SetSkillCommentDto implements MySkillsSetSkillCommentPayload {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsString()
  comment!: string
}

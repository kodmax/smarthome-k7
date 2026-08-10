import { SKILL_EXPERIENCE_LEVEL_ORDER, type SkillExperienceLevel } from '@repo/types'
import { IsIn, IsNotEmpty, IsString } from 'class-validator'

export class SetSkillLevelDto {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsString()
  @IsNotEmpty()
  name!: string

  @IsIn(SKILL_EXPERIENCE_LEVEL_ORDER)
  level!: SkillExperienceLevel
}

export class SetSkillCommentDto {
  @IsString()
  @IsNotEmpty()
  id!: string

  @IsString()
  comment!: string
}

import { IsIn, IsNotEmpty, IsString } from 'class-validator'

const LIGHT_STATES = ['on', 'off'] as const

export class SetLightDto {
  @IsString()
  @IsNotEmpty()
  circuitId!: string

  @IsIn(LIGHT_STATES)
  state!: 'on' | 'off'
}

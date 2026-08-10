import type { LightsSetPayload } from '@repo/types'
import { IsIn, IsNotEmpty, IsString } from 'class-validator'

const LIGHT_STATES = ['on', 'off'] as const

export class SetLightDto implements LightsSetPayload {
  @IsString()
  @IsNotEmpty()
  circuitId!: string

  @IsIn(LIGHT_STATES)
  state!: 'on' | 'off'
}

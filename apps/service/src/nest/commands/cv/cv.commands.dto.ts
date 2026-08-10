import type { CvUploadPayload } from '@repo/types'
import { IsNotEmpty, IsString } from 'class-validator'

/** TODO: assess upload transport — base64-in-JSON may not scale for REST (size, memory, no streaming). */
export class UploadCvDto implements CvUploadPayload {
  @IsString()
  @IsNotEmpty()
  base64!: string
}

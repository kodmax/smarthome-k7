import { IsNotEmpty, IsString } from 'class-validator'

/** TODO: assess upload transport — base64-in-JSON mirrors the WS command but may not scale for REST (size, memory, no streaming). */
export class UploadCvDto {
  @IsString()
  @IsNotEmpty()
  base64!: string
}

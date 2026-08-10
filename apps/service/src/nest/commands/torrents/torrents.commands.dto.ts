import { IsNotEmpty, IsString } from 'class-validator'

export class SearchTorrentsDto {
  @IsString()
  @IsNotEmpty()
  query!: string
}

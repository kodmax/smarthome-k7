import { IsString } from 'class-validator'

export class SearchTorrentsDto {
  @IsString()
  query!: string
}

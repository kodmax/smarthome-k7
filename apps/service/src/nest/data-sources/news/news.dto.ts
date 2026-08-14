import { IsNotEmpty, IsString } from 'class-validator'

export class NewsItemUidDto {
  @IsString()
  @IsNotEmpty()
  itemUid!: string
}

import { IsNotEmpty, IsString } from 'class-validator'

export class DownloadTorrentDto {
  @IsString()
  @IsNotEmpty()
  torrent!: string
}

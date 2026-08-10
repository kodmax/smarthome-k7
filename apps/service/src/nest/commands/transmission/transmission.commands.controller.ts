import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { DataSourceRegistry } from '@repo/feeds'
import { TransmissionSource } from '@/data-sources/transmission'
import { DataSourceRegistryType } from '@/data-sources'
import { DownloadTorrentDto } from './transmission.commands.dto'

@Controller('data-sources/transmission/command')
export class TransmissionCommandsController {
  constructor(private readonly dataSources: DataSourceRegistry<DataSourceRegistryType>) {}

  private source(): TransmissionSource {
    return this.dataSources.get('transmission')
  }

  @Post('download')
  @HttpCode(HttpStatus.NO_CONTENT)
  download(@Body() dto: DownloadTorrentDto): Promise<void> {
    return this.source().download(dto.torrent)
  }
}
